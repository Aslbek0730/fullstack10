from django.urls import path
from .views import LandingSummaryView

urlpatterns = [
    path('summary/', LandingSummaryView.as_view(), name='landing-summary'),
] 