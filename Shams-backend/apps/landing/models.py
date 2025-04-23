from django.db import models

# Create your models here.

class PlatformStatistic(models.Model):
    """Platforma statistikasi"""
    total_users = models.PositiveIntegerField(default=0)
    total_courses = models.PositiveIntegerField(default=0)
    total_tests = models.PositiveIntegerField(default=0)
    total_books = models.PositiveIntegerField(default=0)
    total_ai_interactions = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Platforma statistikasi'
        verbose_name_plural = 'Platforma statistikasi'

    def __str__(self):
        return f'Statistika - {self.created_at.strftime("%Y-%m-%d")}'

class Feature(models.Model):
    """Platforma xususiyatlari"""
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(max_length=50)  # Emoji yoki icon nomi
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Xususiyat'
        verbose_name_plural = 'Xususiyatlar'
        ordering = ['order']

    def __str__(self):
        return self.title
