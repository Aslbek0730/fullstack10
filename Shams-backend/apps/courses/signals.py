from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Course, Lesson, Enrollment, LessonProgress

User = get_user_model()

@receiver(post_save, sender=Enrollment)
def create_lesson_progress(sender, instance, created, **kwargs):
    """Create lesson progress records when a user enrolls in a course"""
    if created:
        course = instance.course
        lessons = Lesson.objects.filter(course=course)
        for lesson in lessons:
            LessonProgress.objects.create(
                user=instance.user,
                lesson=lesson,
                enrollment=instance
            ) 