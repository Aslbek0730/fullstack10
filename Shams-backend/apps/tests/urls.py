from django.urls import path
from . import views

app_name = 'tests'

urlpatterns = [
    # Test URLs
    path('tests/', views.TestListView.as_view(), name='test-list'),
    path('tests/<uuid:pk>/', views.TestDetailView.as_view(), name='test-detail'),
    path('tests/<uuid:pk>/submit/', views.TestSubmitView.as_view(), name='test-submit'),
    
    # Test Result URLs
    path('test-results/my/', views.TestResultListView.as_view(), name='test-result-list'),
    
    # Admin URLs
    path('questions/', views.QuestionCreateView.as_view(), name='question-create'),
] 