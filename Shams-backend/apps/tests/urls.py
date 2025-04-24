from django.urls import path
from .views import (
    TestListView,
    TestDetailView,
    TestSubmitView,
    QuestionCreateView,
    TestResultListView
)

app_name = 'tests'

urlpatterns = [
    # Test URLs
    path('', TestListView.as_view(), name='test-list'),
    path('<int:pk>/', TestDetailView.as_view(), name='test-detail'),
    path('<int:pk>/submit/', TestSubmitView.as_view(), name='test-submit'),
    
    # Question URLs
    path('questions/create/', QuestionCreateView.as_view(), name='question-create'),
    
    # Test Result URLs
    path('results/', TestResultListView.as_view(), name='result-list'),
] 