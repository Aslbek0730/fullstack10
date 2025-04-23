from django.contrib import admin
from .models import Course, Lesson, Enrollment, LessonProgress, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'created_by', 'is_active', 'created_at')
    list_filter = ('category', 'level', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'created_by__email')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-created_at',)
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'description')}),
        ('Kategoriya va Daraja', {'fields': ('category', 'level')}),
        ('Media', {'fields': ('thumbnail',)}),
        ('Status', {'fields': ('is_active',)}),
        ('Yaratuvchi', {'fields': ('created_by',)}),
    )

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description', 'course__title')
    ordering = ('course', 'order')
    fieldsets = (
        (None, {'fields': ('course', 'title', 'description')}),
        ('Media', {'fields': ('video_url',)}),
        ('Tartib', {'fields': ('order',)}),
        ('Status', {'fields': ('is_active',)}),
    )

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress', 'enrolled_at', 'created_at')
    list_filter = ('progress', 'enrolled_at', 'created_at')
    search_fields = ('user__email', 'course__title')
    ordering = ('-enrolled_at',)

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('enrollment', 'lesson', 'is_completed', 'last_position', 'created_at')
    list_filter = ('is_completed', 'created_at')
    search_fields = ('enrollment__user__email', 'lesson__title')
    ordering = ('-created_at',)
