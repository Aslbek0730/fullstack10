from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.cache import cache
from apps.courses.models import Course, Lesson
from apps.tests.models import Test
from apps.library.models import Book
from .models import AdminLog
from .serializers import (
    AdminLogSerializer,
    CourseCreateSerializer,
    LessonCreateSerializer,
    TestCreateSerializer,
    BookCreateSerializer
)

class AdminViewSet(viewsets.ViewSet):
    """Admin panel"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def _create_admin_log(self, user, action, model, object_id, description):
        """Admin faoliyatini saqlash"""
        AdminLog.objects.create(
            user=user,
            action=action,
            model=model,
            object_id=object_id,
            description=description
        )
    
    @action(detail=False, methods=['post'])
    def create_course(self, request):
        """Kurs yaratish"""
        serializer = CourseCreateSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.save()
            
            # Admin faoliyatini saqlash
            self._create_admin_log(
                user=request.user,
                action='create',
                model='Course',
                object_id=course.id,
                description=f'Yangi kurs yaratildi: {course.title}'
            )
            
            # Cache'ni tozalash
            cache.delete_pattern('courses:*')
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def create_lesson(self, request):
        """Dars yaratish"""
        serializer = LessonCreateSerializer(data=request.data)
        if serializer.is_valid():
            lesson = serializer.save()
            
            # Admin faoliyatini saqlash
            self._create_admin_log(
                user=request.user,
                action='create',
                model='Lesson',
                object_id=lesson.id,
                description=f'Yangi dars yaratildi: {lesson.title}'
            )
            
            # Cache'ni tozalash
            cache.delete_pattern('courses:*')
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def create_test(self, request):
        """Test yaratish"""
        serializer = TestCreateSerializer(data=request.data)
        if serializer.is_valid():
            test = serializer.save()
            
            # Admin faoliyatini saqlash
            self._create_admin_log(
                user=request.user,
                action='create',
                model='Test',
                object_id=test.id,
                description=f'Yangi test yaratildi: {test.title}'
            )
            
            # Cache'ni tozalash
            cache.delete_pattern('tests:*')
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def create_book(self, request):
        """Kitob yaratish"""
        serializer = BookCreateSerializer(data=request.data)
        if serializer.is_valid():
            book = serializer.save()
            
            # Admin faoliyatini saqlash
            self._create_admin_log(
                user=request.user,
                action='create',
                model='Book',
                object_id=book.id,
                description=f'Yangi kitob yaratildi: {book.title}'
            )
            
            # Cache'ni tozalash
            cache.delete_pattern('library:*')
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def logs(self, request):
        """Admin faoliyatlari"""
        logs = AdminLog.objects.all()
        serializer = AdminLogSerializer(logs, many=True)
        return Response(serializer.data) 