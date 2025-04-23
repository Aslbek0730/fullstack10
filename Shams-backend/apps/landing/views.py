from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.cache import cache
from .models import PlatformStatistic, Feature
from .serializers import PlatformStatisticSerializer, FeatureSerializer

# Create your views here.

class LandingSummaryView(APIView):
    """Bosh sahifa uchun umumiy ma'lumotlar"""
    permission_classes = [AllowAny]

    def get(self, request):
        # Cache'dan ma'lumotlarni olish
        cache_key = 'landing_summary'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        # Statistikani olish
        try:
            stats = PlatformStatistic.objects.latest('created_at')
            stats_serializer = PlatformStatisticSerializer(stats)
        except PlatformStatistic.DoesNotExist:
            stats_serializer = PlatformStatisticSerializer(PlatformStatistic())
        
        # Xususiyatlarni olish
        features = Feature.objects.filter(is_active=True)
        features_serializer = FeatureSerializer(features, many=True)
        
        # Javobni tayyorlash
        response_data = {
            'statistics': stats_serializer.data,
            'features': features_serializer.data
        }
        
        # Cache'ga saqlash (1 soat)
        cache.set(cache_key, response_data, 3600)
        
        return Response(response_data)
