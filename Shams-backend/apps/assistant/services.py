import openai
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta

class AIService:
    def __init__(self):
        self.model = "gpt-3.5-turbo"
        self.temperature = 0.7
        self.max_tokens = 1000
        openai.api_key = settings.OPENAI_API_KEY

    def _generate_prompt(self, history):
        """Generate prompt from conversation history"""
        messages = [
            {"role": "system", "content": "You are a helpful AI assistant."}
        ]
        
        for message in history:
            role = "user" if message.sender == "user" else "assistant"
            messages.append({"role": role, "content": message.text})
        
        return messages

    def get_response(self, user_input, history):
        """Get AI response for user input"""
        # Check rate limit
        user_id = history[0].conversation.user.id if history else None
        if user_id:
            cache_key = f"ai_requests_{user_id}_{timezone.now().date()}"
            requests_count = cache.get(cache_key, 0)
            
            if requests_count >= 20:  # Daily limit
                raise Exception("Daily request limit exceeded")
            
            cache.set(cache_key, requests_count + 1, 86400)  # 24 hours

        # Generate response
        messages = self._generate_prompt(history)
        messages.append({"role": "user", "content": user_input})
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"AI service error: {str(e)}")

    def detect_spam(self, text):
        """Detect if message is spam"""
        # Implement spam detection logic here
        # For now, just check for common spam patterns
        spam_patterns = [
            "buy now",
            "click here",
            "free money",
            "lottery",
            "winner"
        ]
        
        text_lower = text.lower()
        return any(pattern in text_lower for pattern in spam_patterns) 