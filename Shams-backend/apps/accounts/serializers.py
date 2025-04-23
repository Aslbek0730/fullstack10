from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import User, UserActivity, UserProgress

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'avatar',
            'full_name',
            'is_verified',
            'date_joined'
        ]
        read_only_fields = ['id', 'is_verified', 'date_joined']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'full_name'
        ]
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'full_name',
            'avatar'
        ]
    
    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError('This username is already taken')
        return value

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(required=True, style={'input_type': 'password'})
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        return data

class OAuthLoginSerializer(serializers.Serializer):
    access_token = serializers.CharField(required=True)

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = [
            'id',
            'activity_type',
            'title',
            'description',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class UserProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = UserProgress
        fields = [
            'course_title',
            'progress',
            'last_accessed'
        ]

class DashboardOverviewSerializer(serializers.ModelSerializer):
    total_courses = serializers.SerializerMethodField()
    total_tests = serializers.SerializerMethodField()
    total_books = serializers.SerializerMethodField()
    total_ai_interactions = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'total_courses',
            'total_tests',
            'total_books',
            'total_ai_interactions'
        ]
    
    def get_total_courses(self, obj):
        return obj.progress.count()
    
    def get_total_tests(self, obj):
        return obj.activities.filter(activity_type='test').count()
    
    def get_total_books(self, obj):
        return obj.activities.filter(activity_type='book').count()
    
    def get_total_ai_interactions(self, obj):
        return obj.activities.filter(activity_type='ai').count() 