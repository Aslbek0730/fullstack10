from django.shortcuts import render
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from .models import Test, Question, Option, TestResult, UserAnswer
from .serializers import (
    TestSerializer,
    QuestionSerializer,
    TestResultSerializer,
    TestDetailSerializer,
    TestSubmitSerializer,
    TestCreateSerializer,
    QuestionCreateSerializer
)
from apps.accounts.models import UserActivity
import random

class TestViewSet(viewsets.ReadOnlyModelViewSet):
    """Testlar"""
    queryset = Test.objects.filter(is_active=True)
    serializer_class = TestSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        """Testni yakunlash"""
        test = self.get_object()
        
        # Test natijasini tekshirish
        if test.results.filter(user=request.user).exists():
            return Response(
                {'detail': 'Siz allaqachon bu testni topshirgansiz'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Javoblarni olish
        answers = request.data.get('answers', [])
        if not answers:
            return Response(
                {'detail': 'Javoblar kiritilmagan'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Test natijasini yaratish
        result = TestResult.objects.create(
            user=request.user,
            test=test,
            time_spent=request.data.get('time_spent', 0)
        )
        
        # Javoblarni saqlash
        correct_answers = 0
        for answer in answers:
            question = get_object_or_404(Question, id=answer['question_id'])
            option = get_object_or_404(Option, id=answer['option_id'])
            
            # Javobni saqlash
            UserAnswer.objects.create(
                result=result,
                question=question,
                selected_option=option,
                is_correct=option.is_correct
            )
            
            if option.is_correct:
                correct_answers += 1
        
        # Natijani hisoblash
        total_questions = test.questions.count()
        result.correct_answers = correct_answers
        result.incorrect_answers = total_questions - correct_answers
        result.score = int((correct_answers / total_questions) * 100)
        result.is_completed = True
        result.save()
        
        # Faoliyat yaratish
        UserActivity.objects.create(
            user=request.user,
            activity_type='test',
            title=f'Test topshirildi: {test.title}',
            description=f'Siz {test.title} testini {result.score}% natija bilan topshirdingiz'
        )
        
        return Response(
            TestResultSerializer(result).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def results(self, request, pk=None):
        """Test natijasi"""
        test = self.get_object()
        
        # Natijani olish
        try:
            result = test.results.get(user=request.user)
            serializer = TestResultSerializer(result)
            return Response(serializer.data)
        except TestResult.DoesNotExist:
            return Response(
                {'detail': 'Test natijasi topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )

class TestListView(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Test.objects.all()
        category = self.request.query_params.get('category', None)
        time_limit = self.request.query_params.get('time_limit', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if time_limit:
            queryset = queryset.filter(time_limit__lte=time_limit)
        if search:
            queryset = queryset.filter(title__icontains=search)
        
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TestCreateSerializer
        return self.serializer_class

class TestDetailView(generics.RetrieveAPIView):
    queryset = Test.objects.all()
    serializer_class = TestDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Shuffle questions for each request
        for test in queryset:
            questions = list(test.questions.all())
            random.shuffle(questions)
            test.questions.all = lambda: questions
        return queryset

class TestSubmitView(generics.CreateAPIView):
    serializer_class = TestSubmitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        test = get_object_or_404(Test, pk=kwargs['pk'])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        answers = serializer.validated_data['answers']
        questions = test.questions.all()
        
        # Calculate score
        correct_answers = 0
        total_questions = questions.count()
        
        for question in questions:
            if str(question.id) in answers and answers[str(question.id)] == question.correct_option:
                correct_answers += 1
        
        score = int((correct_answers / total_questions) * 100)
        
        # Create test result
        result = TestResult.objects.create(
            user=request.user,
            test=test,
            score=score
        )
        
        return Response({
            'score': score,
            'total': total_questions,
            'correct': correct_answers,
            'message': self._get_message(score)
        }, status=status.HTTP_201_CREATED)
    
    def _get_message(self, score):
        if score >= 90:
            return "Ajoyib natija!"
        elif score >= 80:
            return "Yaxshi natija!"
        elif score >= 70:
            return "Yaxshi!"
        elif score >= 60:
            return "Qoniqarli!"
        else:
            return "Qayta urinib ko'ring!"

class TestResultListView(generics.ListAPIView):
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TestResult.objects.filter(user=self.request.user)

class QuestionCreateView(generics.CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionCreateSerializer
    permission_classes = [permissions.IsAdminUser]
