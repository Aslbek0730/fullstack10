from django.db import models
from django.conf import settings
from apps.courses.models import Course
from apps.library.models import Book

class Payment(models.Model):
    """To'lov"""
    PAYMENT_TYPES = (
        ('course', 'Kurs'),
        ('book', 'Kitob'),
    )
    
    PAYMENT_STATUS = (
        ('pending', 'Kutilmoqda'),
        ('completed', 'Yakunlandi'),
        ('failed', 'Xatolik'),
        ('cancelled', 'Bekor qilindi'),
    )
    
    PAYMENT_PROVIDERS = (
        ('payme', 'Payme'),
        ('click', 'Click'),
        ('uzum', 'Uzum'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPES)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True, related_name='payments')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    provider = models.CharField(max_length=10, choices=PAYMENT_PROVIDERS)
    provider_transaction_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'To\'lov'
        verbose_name_plural = 'To\'lovlar'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.get_payment_type_display()} - {self.amount}'

class PaymentLog(models.Model):
    """To'lov logi"""
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=100)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'To\'lov logi'
        verbose_name_plural = 'To\'lov loglari'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.payment} - {self.action}'
