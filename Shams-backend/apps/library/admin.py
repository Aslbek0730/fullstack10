from django.contrib import admin
from .models import Book, BookPurchase, BookDownload

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'price', 'is_active', 'created_at')
    list_filter = ('category', 'status', 'is_active', 'created_at')
    search_fields = ('title', 'author', 'description')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {'fields': ('title', 'author', 'description')}),
        ('Kategoriya va Status', {'fields': ('category', 'status')}),
        ('Narx', {'fields': ('price', 'discount')}),
        ('Media', {'fields': ('file', 'preview_file')}),
        ('Status', {'fields': ('is_active',)}),
        ('Yaratuvchi', {'fields': ('uploaded_by',)}),
    )

@admin.register(BookPurchase)
class BookPurchaseAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'paid_amount', 'payment_method', 'paid_at')
    list_filter = ('payment_method', 'paid_at')
    search_fields = ('user__email', 'book__title', 'transaction_id')
    ordering = ('-paid_at',)

@admin.register(BookDownload)
class BookDownloadAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'download_date', 'ip_address')
    list_filter = ('download_date',)
    search_fields = ('user__email', 'book__title')
    ordering = ('-download_date',)
