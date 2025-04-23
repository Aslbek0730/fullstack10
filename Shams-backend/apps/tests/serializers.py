from rest_framework import serializers
from .models import Test, Question, Option, TestResult, UserAnswer
from apps.courses.serializers import CategorySerializer

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = [
            'id',
            'text',
            'order'
        ]

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = [
            'id',
            'text',
            'option_a',
            'option_b',
            'option_c',
            'option_d'
        ]

class QuestionWithAnswerSerializer(QuestionSerializer):
    class Meta(QuestionSerializer.Meta):
        fields = QuestionSerializer.Meta.fields + ['correct_option']

class TestSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    questions_count = serializers.SerializerMethodField()
    has_result = serializers.SerializerMethodField()
    
    class Meta:
        model = Test
        fields = [
            'id',
            'title',
            'category',
            'description',
            'time_limit',
            'questions_count',
            'created_at'
        ]
    
    def get_questions_count(self, obj):
        return obj.questions.count()
    
    def get_has_result(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.results.filter(user=request.user).exists()
        return False

class TestDetailSerializer(TestSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta(TestSerializer.Meta):
        fields = TestSerializer.Meta.fields + ['questions']

class UserAnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    selected_option = OptionSerializer(read_only=True)
    
    class Meta:
        model = UserAnswer
        fields = [
            'id',
            'question',
            'selected_option',
            'is_correct'
        ]

class TestResultSerializer(serializers.ModelSerializer):
    test = TestSerializer(read_only=True)
    answers = UserAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = TestResult
        fields = [
            'id',
            'test',
            'score',
            'completed_at',
            'feedback'
        ]

class TestSubmitSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.ChoiceField(choices=['A', 'B', 'C', 'D']),
        help_text='Dictionary of question_id: answer'
    )

class TestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = [
            'title',
            'category',
            'description',
            'time_limit'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class QuestionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'test',
            'text',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'correct_option'
        ] 