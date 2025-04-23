from rest_framework import serializers
from apps.courses.models import Course, Lesson
from apps.tests.models import Test
from apps.library.models import Book
from .models import AdminLog

class AdminLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminLog
        fields = [
            'id',
            'user',
            'action',
            'model',
            'object_id',
            'description',
            'created_at'
        ]

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'title',
            'slug',
            'description',
            'category',
            'image',
            'price',
            'duration',
            'level'
        ]

class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'course',
            'title',
            'description',
            'video_url',
            'duration',
            'order'
        ]

class TestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = [
            'title',
            'description',
            'category',
            'time_limit',
            'passing_score'
        ]

class BookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'title',
            'description',
            'category',
            'file',
            'preview_image',
            'price'
        ]
 