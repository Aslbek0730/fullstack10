from rest_framework import serializers
from .models import Book, BookPurchase, BookDownload
from apps.courses.serializers import CategorySerializer

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    is_downloaded = serializers.SerializerMethodField()
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    preview_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'description',
            'category',
            'status',
            'price',
            'discount',
            'final_price',
            'preview_url',
            'upload_date',
            'is_downloaded'
        ]
    
    def get_is_downloaded(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.downloads.filter(user=request.user).exists()
        return False

    def get_preview_url(self, obj):
        if obj.preview_file:
            return self.context['request'].build_absolute_uri(obj.preview_file.url)
        return None

class BookDetailSerializer(BookSerializer):
    file_url = serializers.SerializerMethodField()
    purchase_required = serializers.SerializerMethodField()
    
    class Meta(BookSerializer.Meta):
        fields = BookSerializer.Meta.fields + ['file_url', 'purchase_required']
    
    def get_file_url(self, obj):
        request = self.context['request']
        user = request.user
        
        # Free book or user has purchased
        if obj.status == 'free' or obj.purchases.filter(user=user).exists():
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def get_purchase_required(self, obj):
        request = self.context['request']
        user = request.user
        
        if obj.status == 'free':
            return False
        return not obj.purchases.filter(user=user).exists()

class BookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'title',
            'author',
            'description',
            'category',
            'file',
            'preview_file',
            'status',
            'price',
            'discount'
        ]
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)

class BookUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'title',
            'author',
            'description',
            'category',
            'status',
            'price',
            'discount'
        ]

class BookPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookPurchase
        fields = [
            'id',
            'book',
            'paid_amount',
            'paid_at',
            'payment_method',
            'transaction_id'
        ]
        read_only_fields = ['id', 'paid_amount', 'paid_at', 'transaction_id']

class BookPurchaseCreateSerializer(serializers.Serializer):
    method = serializers.ChoiceField(choices=['payme', 'click', 'uzum'])
    card_number = serializers.CharField(max_length=16)

class BookDownloadSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = BookDownload
        fields = [
            'id',
            'book',
            'download_date',
            'ip_address'
        ]
        read_only_fields = ['id', 'download_date', 'ip_address'] 