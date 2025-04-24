from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardOverviewView,
    RecentActivityView,
    MyProgressView,
    UserRegisterView,
    EmailVerificationView,
    UserLoginView,
    UserProfileView,
    PasswordResetView,
    PasswordResetConfirmView,
    GoogleLoginView,
    FacebookLoginView,
    UserActivityListView
)
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'accounts'

urlpatterns = [
    # Dashboard URLs
    path('dashboard/overview/', DashboardOverviewView.as_view(), name='dashboard-overview'),
    path('dashboard/recent-activity/', RecentActivityView.as_view(), name='recent-activity'),
    path('dashboard/my-progress/', MyProgressView.as_view(), name='my-progress'),
    
    # Authentication URLs
    path('auth/register/', UserRegisterView.as_view(), name='register'),
    path('auth/verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # OAuth URLs
    path('auth/google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/facebook-login/', FacebookLoginView.as_view(), name='facebook-login'),
    
    # Profile URLs
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Activity URLs
    path('activities/', UserActivityListView.as_view(), name='activity-list'),
] 