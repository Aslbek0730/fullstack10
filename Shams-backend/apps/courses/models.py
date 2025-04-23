import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

# Create your models here.

class ChatMessage(models.Model):
    """Chat xabarlari"""
    ROLE_CHOICES = (
        ('user', 'Foydalanuvchi'),
        ('assistant', 'Yordamchi'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_chat_messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    audio_url = models.URLField(blank=True, null=True)  # Text-to-speech uchun
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Chat xabari'
        verbose_name_plural = 'Chat xabarlari'
        ordering = ['created_at']
    
    def __str__(self):
        return f'{self.user.username} - {self.role} - {self.created_at}'

class Category(models.Model):
    """Kurs kategoriyasi"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50)  # Emoji yoki icon nomi
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Kategoriya'
        verbose_name_plural = 'Kategoriyalar'
        ordering = ['order']

    def __str__(self):
        return self.name

class Course(models.Model):
    """Kurs"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_('title'), max_length=255)
    slug = models.SlugField(_('slug'), unique=True)
    description = models.TextField(_('description'))
    category = models.CharField(
        _('category'),
        max_length=20,
        choices=[
            ('ai', 'AI'),
            ('robotics', 'Robotics'),
            ('programming', 'Programming')
        ]
    )
    level = models.CharField(
        _('level'),
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced')
        ]
    )
    thumbnail = models.ImageField(_('thumbnail'), upload_to='courses/thumbnails/')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_courses'
    )
    is_active = models.BooleanField(_('is active'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('course')
        verbose_name_plural = _('courses')
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Lesson(models.Model):
    """Dars"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(_('title'), max_length=255)
    video_url = models.URLField(_('video url'))
    description = models.TextField(_('description'), blank=True)
    order = models.PositiveIntegerField(_('order'), default=0)
    is_active = models.BooleanField(_('is active'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('lesson')
        verbose_name_plural = _('lessons')
        ordering = ['order']
        unique_together = ['course', 'order']

    def __str__(self):
        return f'{self.course.title} - {self.title}'

class Enrollment(models.Model):
    """Kursga yozilish"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    progress = models.PositiveIntegerField(_('progress'), default=0)  # 0-100%
    enrolled_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('enrollment')
        verbose_name_plural = _('enrollments')
        unique_together = ['user', 'course']

    def __str__(self):
        return f'{self.user.email} - {self.course.title}'

class LessonProgress(models.Model):
    """Dars progressi"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    is_completed = models.BooleanField(_('is completed'), default=False)
    last_position = models.PositiveIntegerField(_('last position'), default=0)  # Video pozitsiyasi (sekundlarda)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('lesson progress')
        verbose_name_plural = _('lesson progress')
        unique_together = ['enrollment', 'lesson']

    def __str__(self):
        return f'{self.enrollment.user.email} - {self.lesson.title}'
