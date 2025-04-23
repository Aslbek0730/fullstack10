import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from apps.courses.models import Category

class Book(models.Model):
    """Kitob"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_('title'), max_length=255)
    author = models.CharField(_('author'), max_length=255)
    description = models.TextField(_('description'))
    category = models.CharField(
        _('category'),
        max_length=20,
        choices=[
            ('programming', 'Programming'),
            ('ai', 'AI'),
            ('robotics', 'Robotics')
        ]
    )
    file = models.FileField(_('file'), upload_to='books/')
    preview_file = models.FileField(_('preview file'), upload_to='books/previews/', null=True, blank=True)
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=[
            ('free', 'Free'),
            ('paid', 'Paid'),
            ('discounted', 'Discounted')
        ]
    )
    price = models.DecimalField(_('price'), max_digits=10, decimal_places=2, default=Decimal('0.00'))
    discount = models.DecimalField(_('discount'), max_digits=5, decimal_places=2, default=Decimal('0.00'))
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_books'
    )
    download_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('book')
        verbose_name_plural = _('books')
        ordering = ['-upload_date']

    def __str__(self):
        return self.title

    @property
    def final_price(self):
        if self.status == 'free':
            return Decimal('0.00')
        elif self.status == 'discounted':
            return self.price * (1 - self.discount / 100)
        return self.price

class BookPurchase(models.Model):
    """Kitob sotib olish"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='book_purchases'
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='purchases')
    paid_amount = models.DecimalField(_('paid amount'), max_digits=10, decimal_places=2)
    paid_at = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(
        _('payment method'),
        max_length=20,
        choices=[
            ('payme', 'Payme'),
            ('click', 'Click'),
            ('uzum', 'Uzum')
        ]
    )
    transaction_id = models.CharField(_('transaction ID'), max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('book purchase')
        verbose_name_plural = _('book purchases')
        ordering = ['-paid_at']
        unique_together = ['user', 'book']

    def __str__(self):
        return f'{self.user.email} - {self.book.title}'

class BookDownload(models.Model):
    """Kitob yuklab olish"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='book_downloads'
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='downloads')
    download_date = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()

    class Meta:
        verbose_name = _('book download')
        verbose_name_plural = _('book downloads')
        ordering = ['-download_date']
        unique_together = ['user', 'book', 'ip_address']

    def __str__(self):
        return f'{self.user.email} - {self.book.title}'
