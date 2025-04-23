from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.cache import cache
from .models import User, UserActivity, UserProgress, EmailVerificationToken, PasswordResetToken
from .serializers import (
    DashboardOverviewSerializer,
    UserActivitySerializer,
    UserProgressSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    SocialLoginSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    ProfileUpdateSerializer,
    UserRegisterSerializer,
    UserLoginSerializer,
    UserProfileUpdateSerializer,
    OAuthLoginSerializer
)
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
import secrets
import uuid
from datetime import timedelta
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenRefreshView

# Create your views here.

class DashboardOverviewView(APIView):
    """Dashboard umumiy ma'lumotlari"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Cache'dan ma'lumotlarni olish
        cache_key = f'dashboard_overview_{request.user.id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        # Ma'lumotlarni olish
        serializer = DashboardOverviewSerializer(request.user)
        
        # Cache'ga saqlash (5 daqiqa)
        cache.set(cache_key, serializer.data, 300)
        
        return Response(serializer.data)

class RecentActivityView(APIView):
    """Oxirgi faoliyatlar"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Cache'dan ma'lumotlarni olish
        cache_key = f'recent_activity_{request.user.id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        # Oxirgi 5 faoliyatni olish
        activities = UserActivity.objects.filter(user=request.user)[:5]
        serializer = UserActivitySerializer(activities, many=True)
        
        # Cache'ga saqlash (5 daqiqa)
        cache.set(cache_key, serializer.data, 300)
        
        return Response(serializer.data)

class MyProgressView(APIView):
    """Kurslar bo'yicha progress"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Cache'dan ma'lumotlarni olish
        cache_key = f'my_progress_{request.user.id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        # Progress ma'lumotlarini olish
        progress = UserProgress.objects.filter(user=request.user)
        serializer = UserProgressSerializer(progress, many=True)
        
        # Cache'ga saqlash (5 daqiqa)
        cache.set(cache_key, serializer.data, 300)
        
        return Response(serializer.data)

class AuthViewSet(viewsets.ViewSet):
    """Autentifikatsiya"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Ro'yxatdan o'tish"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Email tasdiqlash tokeni yaratish
            token = secrets.token_urlsafe(32)
            user.email_verification_token = token
            user.save()
            
            # Email yuborish
            send_mail(
                'Email tasdiqlash',
                f'Emailingizni tasdiqlash uchun quyidagi linkni bosing: {settings.FRONTEND_URL}/verify-email/{token}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            # JWT token yaratish
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Ro\'yxatdan o\'tish muvaffaqiyatli! Emailingizni tasdiqlang.',
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Kirish"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            if user:
                if not user.is_active:
                    return Response(
                        {'detail': 'Emailingiz tasdiqlanmagan'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                })
            return Response(
                {'detail': 'Email yoki parol noto\'g\'ri'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def social_login(self, request):
        """Ijtimoiy tarmoqlar orqali kirish"""
        serializer = SocialLoginSerializer(data=request.data)
        if serializer.is_valid():
            provider = serializer.validated_data['provider']
            access_token = serializer.validated_data['access_token']
            
            # Ijtimoiy tarmoq API orqali foydalanuvchi ma'lumotlarini olish
            if provider == 'google':
                # Google API orqali ma'lumotlarni olish
                pass
            elif provider == 'facebook':
                # Facebook API orqali ma'lumotlarni olish
                pass
            
            # Foydalanuvchini yaratish yoki olish
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create_user(
                    email=email,
                    full_name=name,
                    profile_image=profile_image
                )
            
            # JWT token yaratish
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def password_reset(self, request):
        """Parolni tiklash"""
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                
                # Parol tiklash tokeni yaratish
                token = secrets.token_urlsafe(32)
                user.reset_password_token = token
                user.save()
                
                # Email yuborish
                send_mail(
                    'Parolni tiklash',
                    f'Parolingizni tiklash uchun quyidagi linkni bosing: {settings.FRONTEND_URL}/reset-password/{token}',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                
                return Response({'detail': 'Parol tiklash havolasi emailingizga yuborildi'})
            except User.DoesNotExist:
                return Response(
                    {'detail': 'Bunday email topilmadi'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def password_reset_confirm(self, request):
        """Parolni tiklashni tasdiqlash"""
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            try:
                user = User.objects.get(reset_password_token=token)
                
                # Parolni yangilash
                user.set_password(serializer.validated_data['password'])
                user.reset_password_token = ''
                user.save()
                
                return Response({'detail': 'Parol muvaffaqiyatli yangilandi'})
            except User.DoesNotExist:
                return Response(
                    {'detail': 'Noto\'g\'ri token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def user(self, request):
        """Foydalanuvchi ma'lumotlari"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def profile_update(self, request):
        """Profilni yangilash"""
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def verify_email(self, request):
        """Emailni tasdiqlash"""
        token = request.data.get('token')
        if not token:
            return Response(
                {'detail': 'Token kiritilmagan'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email_verification_token=token)
            user.is_active = True
            user.email_verification_token = ''
            user.save()
            
            return Response({'detail': 'Email muvaffaqiyatli tasdiqlandi'})
        except User.DoesNotExist:
            return Response(
                {'detail': 'Noto\'g\'ri token'},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create verification token
        token = uuid.uuid4().hex
        expires_at = timezone.now() + timedelta(hours=24)
        EmailVerificationToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # Send verification email
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        send_mail(
            'Verify your email',
            f'Click the link to verify your email: {verification_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Registration successful. Please check your email for verification.'
        }, status=status.HTTP_201_CREATED)

class EmailVerificationView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response(
                {'detail': 'Token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        verification = get_object_or_404(
            EmailVerificationToken,
            token=token,
            expires_at__gt=timezone.now()
        )
        
        user = verification.user
        user.is_verified = True
        user.save()
        
        verification.delete()
        
        return Response({
            'message': 'Email verified successfully'
        })

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = get_object_or_404(User, email=serializer.validated_data['email'])
        
        if not user.check_password(serializer.validated_data['password']):
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_verified:
            return Response(
                {'detail': 'Please verify your email first'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        return self.request.user

class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = get_object_or_404(User, email=email)
        
        # Create reset token
        token = uuid.uuid4().hex
        expires_at = timezone.now() + timedelta(hours=1)
        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # Send reset email
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        send_mail(
            'Reset your password',
            f'Click the link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Password reset link has been sent to your email'
        })

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        reset_token = get_object_or_404(
            PasswordResetToken,
            token=token,
            expires_at__gt=timezone.now()
        )
        
        user = reset_token.user
        user.set_password(serializer.validated_data['password'])
        user.save()
        
        reset_token.delete()
        
        return Response({
            'message': 'Password has been reset successfully'
        })

class GoogleLoginView(generics.GenericAPIView):
    serializer_class = OAuthLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        access_token = serializer.validated_data['access_token']
        
        # TODO: Implement Google OAuth verification
        # For now, just create a new user
        user, created = User.objects.get_or_create(
            email='google@example.com',
            defaults={
                'username': f'google_{uuid.uuid4().hex[:8]}',
                'is_verified': True,
                'is_oauth': True
            }
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })

class FacebookLoginView(generics.GenericAPIView):
    serializer_class = OAuthLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        access_token = serializer.validated_data['access_token']
        
        # TODO: Implement Facebook OAuth verification
        # For now, just create a new user
        user, created = User.objects.get_or_create(
            email='facebook@example.com',
            defaults={
                'username': f'facebook_{uuid.uuid4().hex[:8]}',
                'is_verified': True,
                'is_oauth': True
            }
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })

class UserActivityListView(generics.ListAPIView):
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)
