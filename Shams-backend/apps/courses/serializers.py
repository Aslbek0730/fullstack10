from rest_framework import serializers
from .models import Category, Course, Lesson, Enrollment, LessonProgress

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon',
            'order'
        ]

class LessonSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    last_position = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = [
            'id',
            'title',
            'video_url',
            'description',
            'order'
        ]
    
    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = obj.progress.get(user=request.user)
                return progress.is_completed
            except LessonProgress.DoesNotExist:
                return False
        return False
    
    def get_last_position(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = obj.progress.get(user=request.user)
                return progress.last_position
            except LessonProgress.DoesNotExist:
                return 0
        return 0

class CourseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    created_by = serializers.SerializerMethodField()
    lessons_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'category',
            'level',
            'thumbnail',
            'created_by',
            'lessons_count',
            'is_enrolled',
            'progress'
        ]
    
    def get_created_by(self, obj):
        return {
            'id': obj.created_by.id,
            'full_name': obj.created_by.full_name
        }
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False
    
    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = obj.enrollments.get(user=request.user)
                return enrollment.progress
            except Enrollment.DoesNotExist:
                return 0
        return 0

class CourseDetailSerializer(CourseSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['lessons']

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id',
            'course',
            'progress',
            'enrolled_at'
        ]

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = [
            'id',
            'lesson',
            'is_completed',
            'last_position'
        ]

class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'title',
            'description',
            'category',
            'level',
            'thumbnail'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'course',
            'title',
            'video_url',
            'description',
            'order'
        ]
    
    def validate_order(self, value):
        course = self.initial_data.get('course')
        if Lesson.objects.filter(course=course, order=value).exists():
            raise serializers.ValidationError("Bu tartib raqami allaqachon mavjud")
        return value 