from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserActivity, UserProgress, EmailVerificationToken, PasswordResetToken

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'full_name', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'is_verified', 'date_joined')
    search_fields = ('email', 'username', 'full_name')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Shaxsiy ma\'lumotlar', {'fields': ('full_name', 'avatar')}),
        ('Ruxsatlar', {'fields': ('is_active', 'is_staff', 'is_verified', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'title', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__email', 'title', 'description')
    ordering = ('-created_at',)

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress', 'last_accessed')
    list_filter = ('progress', 'last_accessed')
    search_fields = ('user__email', 'course__title')
    ordering = ('-last_accessed',)

@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at')
    list_filter = ('created_at', 'expires_at')
    search_fields = ('user__email', 'token')
    ordering = ('-created_at',)

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at')
    list_filter = ('created_at', 'expires_at')
    search_fields = ('user__email', 'token')
    ordering = ('-created_at',)
