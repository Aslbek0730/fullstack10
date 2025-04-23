from django.db import models
from django.conf import settings

class ChatMessage(models.Model):
    """Chat xabari"""
    ROLES = (
        ('user', 'Foydalanuvchi'),
        ('assistant', 'Yordamchi'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    role = models.CharField(max_length=10, choices=ROLES)
    content = models.TextField()
    audio_url = models.URLField(blank=True, null=True)  # Text-to-speech uchun
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Chat xabari'
        verbose_name_plural = 'Chat xabarlari'
        ordering = ['created_at']
    
    def __str__(self):
        return f'{self.user.username} - {self.get_role_display()} - {self.created_at}'
