from django.db import models
from django.conf import settings

class Notification(models.Model):
    """Xabarnoma"""
    NOTIFICATION_TYPES = (
        ('welcome', 'Xush kelibsiz'),
        ('course', 'Kurs'),
        ('test', 'Test'),
        ('book', 'Kitob'),
        ('payment', 'To\'lov'),
        ('system', 'Tizim'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Xabarnoma'
        verbose_name_plural = 'Xabarnomalar'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.get_type_display()}' 