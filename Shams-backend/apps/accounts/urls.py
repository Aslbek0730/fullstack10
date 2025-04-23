from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, DashboardOverviewView, RecentActivityView, MyProgressView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')

app_name = 'accounts'

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/overview/', DashboardOverviewView.as_view(), name='dashboard-overview'),
    path('dashboard/recent-activity/', RecentActivityView.as_view(), name='recent-activity'),
    path('dashboard/my-progress/', MyProgressView.as_view(), name='my-progress'),
    # Authentication URLs
    path('auth/register/', views.UserRegisterView.as_view(), name='register'),
    path('auth/verify-email/', views.EmailVerificationView.as_view(), name='verify-email'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('auth/password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # OAuth URLs
    path('auth/google-login/', views.GoogleLoginView.as_view(), name='google-login'),
    path('auth/facebook-login/', views.FacebookLoginView.as_view(), name='facebook-login'),
    
    # Profile URLs
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('activities/', views.UserActivityListView.as_view(), name='activities'),
] 