from rest_framework import serializers
from .models import PlatformStatistic, Feature

class PlatformStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformStatistic
        fields = [
            'total_users',
            'total_courses',
            'total_tests',
            'total_books',
            'total_ai_interactions',
            'updated_at'
        ]

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = [
            'title',
            'description',
            'icon',
            'order'
        ] 