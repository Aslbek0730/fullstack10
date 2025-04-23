from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """Xabarnomalar"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Xabarnomani o'qilgan deb belgilash"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        
        return Response(
            NotificationSerializer(notification).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Barcha xabarnomalarni o'qilgan deb belgilash"""
        self.get_queryset().update(is_read=True)
        
        return Response(
            {'detail': 'Barcha xabarnomalar o\'qilgan deb belgilandi'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """O'qilmagan xabarnomalar soni"""
        count = self.get_queryset().filter(is_read=False).count()
        
        return Response(
            {'count': count},
            status=status.HTTP_200_OK
        ) 