from django.urls import path
from . import views

app_name = 'assistant'

urlpatterns = [
    # Conversation URLs
    path('conversations/', views.ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<uuid:pk>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<uuid:pk>/message/', views.MessageCreateView.as_view(), name='message-create'),
] 