from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from .models import Payment, PaymentLog
from .serializers import PaymentSerializer, PaymentLogSerializer
from apps.accounts.models import UserActivity
from apps.courses.models import Course
from apps.library.models import Book
from apps.notifications.tasks import send_payment_notification

class PaymentViewSet(viewsets.ModelViewSet):
    """To'lovlar"""
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    def _create_payment_log(self, payment, action, data):
        """To'lov logini yaratish"""
        PaymentLog.objects.create(
            payment=payment,
            action=action,
            data=data
        )
    
    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """To'lovni boshlash"""
        payment_type = request.data.get('payment_type')
        provider = request.data.get('provider')
        
        if payment_type == 'course':
            course_id = request.data.get('course_id')
            course = get_object_or_404(Course, id=course_id)
            amount = course.price
        elif payment_type == 'book':
            book_id = request.data.get('book_id')
            book = get_object_or_404(Book, id=book_id)
            amount = book.price
        else:
            return Response(
                {'detail': 'Noto\'g\'ri to\'lov turi'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # To'lov yaratish
        payment = Payment.objects.create(
            user=request.user,
            payment_type=payment_type,
            course=course if payment_type == 'course' else None,
            book=book if payment_type == 'book' else None,
            amount=amount,
            provider=provider
        )
        
        # To'lov logini yaratish
        self._create_payment_log(
            payment=payment,
            action='initiate',
            data=request.data
        )
        
        # To'lov xizmatiga so'rov yuborish
        if provider == 'payme':
            # Payme API orqali to'lov yaratish
            pass
        elif provider == 'click':
            # Click API orqali to'lov yaratish
            pass
        elif provider == 'uzum':
            # Uzum API orqali to'lov yaratish
            pass
        
        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """To'lovni tekshirish"""
        payment = self.get_object()
        
        # To'lov xizmatidan natijani tekshirish
        if payment.provider == 'payme':
            # Payme API orqali to'lovni tekshirish
            pass
        elif payment.provider == 'click':
            # Click API orqali to'lovni tekshirish
            pass
        elif payment.provider == 'uzum':
            # Uzum API orqali to'lovni tekshirish
            pass
        
        # To'lov logini yaratish
        self._create_payment_log(
            payment=payment,
            action='verify',
            data=request.data
        )
        
        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """To'lov tarixi"""
        payments = self.get_queryset()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def webhook(self, request, pk=None):
        """Webhook"""
        payment = self.get_object()
        
        # Webhook ma'lumotlarini tekshirish
        if payment.provider == 'payme':
            # Payme webhook
            pass
        elif payment.provider == 'click':
            # Click webhook
            pass
        elif payment.provider == 'uzum':
            # Uzum webhook
            pass
        
        # To'lov logini yaratish
        self._create_payment_log(
            payment=payment,
            action='webhook',
            data=request.data
        )
        
        # To'lov muvaffaqiyatli bo'lsa
        if payment.status == 'completed':
            # Kursga yozilish
            if payment.payment_type == 'course':
                from apps.courses.models import Enrollment
                Enrollment.objects.create(
                    user=payment.user,
                    course=payment.course
                )
            
            # Kitobni yuklash
            elif payment.payment_type == 'book':
                from apps.library.models import BookDownload
                BookDownload.objects.create(
                    user=payment.user,
                    book=payment.book
                )
            
            # Faoliyat yaratish
            UserActivity.objects.create(
                user=payment.user,
                activity_type=payment.payment_type,
                title=f'To\'lov yakunlandi: {payment.amount}',
                description=f'Siz {payment.get_payment_type_display()} uchun to\'lov qildingiz'
            )
            
            # Xabarnoma yuborish
            send_payment_notification.delay(
                user_id=payment.user.id,
                payment_id=payment.id
            )
        
        return Response({'status': 'ok'})
