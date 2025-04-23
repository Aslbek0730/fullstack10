from django.contrib import admin
from .models import Test, Question, Option, TestResult, UserAnswer

class OptionInline(admin.TabularInline):
    model = Option
    extra = 4

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'time_limit', 'created_by', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'created_by__email')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {'fields': ('title', 'description')}),
        ('Kategoriya va Vaqt', {'fields': ('category', 'time_limit')}),
        ('Status', {'fields': ('is_active',)}),
        ('Yaratuvchi', {'fields': ('created_by',)}),
    )

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('test', 'text', 'correct_option', 'created_at')
    list_filter = ('test', 'created_at')
    search_fields = ('text', 'test__title')
    ordering = ('test', 'created_at')
    inlines = [OptionInline]

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'score', 'completed_at')
    list_filter = ('score', 'completed_at')
    search_fields = ('user__email', 'test__title')
    ordering = ('-completed_at',)

@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('result', 'question', 'selected_option', 'is_correct', 'created_at')
    list_filter = ('is_correct', 'created_at')
    search_fields = ('result__user__email', 'question__text')
    ordering = ('-created_at',)
