from django.db import models
from django.conf import settings

class AdminLog(models.Model):
    """Admin faoliyati"""
    ACTION_TYPES = (
        ('create', 'Yaratish'),
        ('update', 'Yangilash'),
        ('delete', 'O\'chirish'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_logs')
    action = models.CharField(max_length=10, choices=ACTION_TYPES)
    model = models.CharField(max_length=100)  # Model nomi
    object_id = models.PositiveIntegerField()  # Obyekt ID
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Admin faoliyati'
        verbose_name_plural = 'Admin faoliyatlari'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.get_action_display()} - {self.model}' 