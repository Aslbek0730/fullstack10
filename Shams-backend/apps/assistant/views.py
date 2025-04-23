from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import (
    ConversationSerializer, ConversationCreateSerializer,
    MessageSerializer, MessageCreateSerializer
)
from .services import AIService

class ConversationListView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ConversationCreateSerializer
        return self.serializer_class

class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        conversation = get_object_or_404(
            Conversation,
            pk=kwargs['pk'],
            user=request.user
        )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create user message
        user_message = Message.objects.create(
            conversation=conversation,
            sender='user',
            text=serializer.validated_data['message']
        )
        
        # Check for spam
        ai_service = AIService()
        if ai_service.detect_spam(user_message.text):
            return Response(
                {'detail': 'Message detected as spam'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get AI response
            history = conversation.messages.all()
            ai_response = ai_service.get_response(user_message.text, history)
            
            # Create AI message
            ai_message = Message.objects.create(
                conversation=conversation,
                sender='ai',
                text=ai_response
            )
            
            return Response({
                'user_message': MessageSerializer(user_message).data,
                'ai_message': MessageSerializer(ai_message).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            ) 