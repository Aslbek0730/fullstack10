from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'chatbot'

router = DefaultRouter()
router.register(r'', views.ChatbotViewSet, basename='chatbot')

urlpatterns = router.urls 