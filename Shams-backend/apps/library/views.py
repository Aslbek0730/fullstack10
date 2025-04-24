from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.cache import cache
from django.db import models
from .models import Book, BookDownload, BookPurchase
from .serializers import (
    BookSerializer, BookDetailSerializer, BookCreateSerializer,
    BookUpdateSerializer, BookPurchaseSerializer, BookPurchaseCreateSerializer,
    BookDownloadSerializer
)
import uuid
from apps.accounts.models import UserActivity

class BookListView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = Book.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        status = self.request.query_params.get('status', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if status:
            queryset = queryset.filter(status=status)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(author__icontains=search)
            )
        
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookCreateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookDetailSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Book.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BookUpdateSerializer
        return self.serializer_class

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class BookPurchaseView(generics.CreateAPIView):
    serializer_class = BookPurchaseCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        book = get_object_or_404(Book, pk=kwargs['pk'])
        
        # Check if already purchased
        if book.purchases.filter(user=request.user).exists():
            return Response(
                {'detail': 'You have already purchased this book'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Process payment (integrate with payment gateway)
        payment_method = serializer.validated_data['method']
        card_number = serializer.validated_data['card_number']
        
        # TODO: Implement actual payment processing
        # For now, just create a purchase record
        purchase = BookPurchase.objects.create(
            user=request.user,
            book=book,
            paid_amount=book.final_price,
            payment_method=payment_method,
            transaction_id=f'TRX_{uuid.uuid4().hex[:8]}'
        )
        
        return Response({
            'success': True,
            'message': 'Book purchased successfully',
            'file_url': request.build_absolute_uri(book.file.url)
        }, status=status.HTTP_201_CREATED)

class MyBooksListView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Book.objects.filter(
            models.Q(status='free') |
            models.Q(purchases__user=user)
        ).distinct()

class BookDownloadView(generics.CreateAPIView):
    serializer_class = BookDownloadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        book = get_object_or_404(Book, pk=kwargs['pk'])
        
        # Check if user can download
        if book.status != 'free' and not book.purchases.filter(user=request.user).exists():
            return Response(
                {'detail': 'You need to purchase this book first'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check download limit
        download_count = book.downloads.filter(user=request.user).count()
        if download_count >= 3:
            return Response(
                {'detail': 'You have reached the download limit for this book'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create download record
        download = BookDownload.objects.create(
            user=request.user,
            book=book,
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        # Increment download count
        book.download_count += 1
        book.save()
        
        return Response({
            'success': True,
            'message': 'Download started',
            'file_url': request.build_absolute_uri(book.file.url)
        }, status=status.HTTP_201_CREATED)

class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """Kitoblar"""
    queryset = Book.objects.filter(is_active=True)
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def download(self, request, pk=None):
        """Kitobni yuklash"""
        book = self.get_object()
        
        # Yuklashni tekshirish
        if book.downloads.filter(user=request.user).exists():
            return Response(
                {'detail': 'Siz allaqachon bu kitobni yuklagansiz'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Yuklash yaratish
        download = BookDownload.objects.create(
            user=request.user,
            book=book
        )
        
        # Faoliyat yaratish
        UserActivity.objects.create(
            user=request.user,
            activity_type='book',
            title=f'Kitob yuklandi: {book.title}',
            description=f'Siz {book.title} kitobini yukladingiz'
        )
        
        return Response(
            BookDownloadSerializer(download).data,
            status=status.HTTP_201_CREATED
        )
