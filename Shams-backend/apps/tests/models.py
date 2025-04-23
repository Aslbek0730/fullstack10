import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.courses.models import Category

class Test(models.Model):
    """Test"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_('title'), max_length=255)
    category = models.CharField(
        _('category'),
        max_length=20,
        choices=[
            ('ai', 'AI'),
            ('robotics', 'Robotics'),
            ('programming', 'Programming')
        ]
    )
    description = models.TextField(_('description'))
    time_limit = models.PositiveIntegerField(_('time limit'), help_text='Time limit in minutes')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tests'
    )
    is_active = models.BooleanField(_('is active'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('test')
        verbose_name_plural = _('tests')
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Question(models.Model):
    """Test savoli"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField(_('text'))
    option_a = models.CharField(_('option A'), max_length=255)
    option_b = models.CharField(_('option B'), max_length=255)
    option_c = models.CharField(_('option C'), max_length=255)
    option_d = models.CharField(_('option D'), max_length=255)
    correct_option = models.CharField(
        _('correct option'),
        max_length=1,
        choices=[
            ('A', 'A'),
            ('B', 'B'),
            ('C', 'C'),
            ('D', 'D')
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('question')
        verbose_name_plural = _('questions')
        ordering = ['created_at']

    def __str__(self):
        return f'{self.test.title} - {self.text[:50]}'

class Option(models.Model):
    """Variant"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Variant'
        verbose_name_plural = 'Variantlar'
        ordering = ['order']
        unique_together = ['question', 'order']

    def __str__(self):
        return f'{self.question.text[:50]} - {self.text[:50]}'

class TestResult(models.Model):
    """Test natijasi"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='test_results'
    )
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results')
    score = models.PositiveIntegerField(_('score'), help_text='Score in percentage')
    completed_at = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField(_('feedback'), blank=True)

    class Meta:
        verbose_name = _('test result')
        verbose_name_plural = _('test results')
        ordering = ['-completed_at']

    def __str__(self):
        return f'{self.user.email} - {self.test.title} - {self.score}%'

class UserAnswer(models.Model):
    """Foydalanuvchi javobi"""
    result = models.ForeignKey(TestResult, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Foydalanuvchi javobi'
        verbose_name_plural = 'Foydalanuvchi javoblari'
        unique_together = ['result', 'question']

    def __str__(self):
        return f'{self.result.user.username} - {self.question.text[:50]}'
