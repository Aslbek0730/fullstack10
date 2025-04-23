from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatbotViewSet

router = DefaultRouter()
router.register(r'assistant', ChatbotViewSet, basename='assistant')

urlpatterns = [
    path('', include(router.urls)),
] 