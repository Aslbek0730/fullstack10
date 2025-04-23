from rest_framework import serializers
from .models import Payment, PaymentLog

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'payment_type',
            'course',
            'book',
            'amount',
            'provider',
            'status',
            'created_at'
        ]
        read_only_fields = ['status']

class PaymentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentLog
        fields = [
            'id',
            'payment',
            'action',
            'data',
            'created_at'
        ] 