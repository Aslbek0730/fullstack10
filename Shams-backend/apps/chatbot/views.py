from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
import openai
from django.conf import settings
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from apps.accounts.models import UserActivity

class ChatbotViewSet(viewsets.ModelViewSet):
    """AI yordamchi"""
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ChatMessage.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Foydalanuvchi xabarini saqlash
        user_message = serializer.save(
            user=self.request.user,
            role='user'
        )
        
        # OpenAI API orqali javob olish
        try:
            openai.api_key = settings.OPENAI_API_KEY
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Siz Shams Akademiyasining AI yordamchisisiz. Foydalanuvchilarga kurslar, testlar va kitoblar haqida ma'lumot berasiz."},
                    {"role": "user", "content": user_message.content}
                ]
            )
            assistant_message = response.choices[0].message.content
            
            # Yordamchi javobini saqlash
            ChatMessage.objects.create(
                user=self.request.user,
                role='assistant',
                content=assistant_message
            )
            
            # Faoliyat yaratish
            UserActivity.objects.create(
                user=self.request.user,
                activity_type='ai',
                title='AI yordamchi bilan suhbat',
                description=f'Siz AI yordamchi bilan suhbat qildingiz: {user_message.content[:50]}...'
            )
            
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Chat tarixini ko'rish"""
        messages = self.get_queryset()
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def text_to_speech(self, request):
        """Text-to-speech"""
        text = request.data.get('text')
        if not text:
            return Response(
                {'detail': 'Matn kiritilmagan'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # OpenAI API orqali text-to-speech
            openai.api_key = settings.OPENAI_API_KEY
            response = openai.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=text
            )
            
            # Audio faylni saqlash
            audio_url = response.url
            
            return Response({'audio_url': audio_url})
            
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
