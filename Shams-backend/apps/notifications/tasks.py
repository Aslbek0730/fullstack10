from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Notification
from apps.accounts.models import User
from apps.payments.models import Payment

@shared_task
def send_welcome_email(user_id):
    """Xush kelibsiz xati"""
    user = User.objects.get(id=user_id)
    
    # Email yuborish
    send_mail(
        'Xush kelibsiz!',
        f'Salom {user.first_name}!\n\nShams Akademiyasiga xush kelibsiz. Siz muvaffaqiyatli ro\'yxatdan o\'tdingiz.',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
    
    # Xabarnoma yaratish
    Notification.objects.create(
        user=user,
        type='welcome',
        title='Xush kelibsiz!',
        message='Shams Akademiyasiga xush kelibsiz. Siz muvaffaqiyatli ro\'yxatdan o\'tdingiz.'
    )

@shared_task
def send_course_notification(user_id, course_id):
    """Kurs xabarnomasi"""
    user = User.objects.get(id=user_id)
    course = Course.objects.get(id=course_id)
    
    # Email yuborish
    send_mail(
        'Kursga yozildingiz',
        f'Salom {user.first_name}!\n\nSiz {course.title} kursiga muvaffaqiyatli yozildingiz.',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
    
    # Xabarnoma yaratish
    Notification.objects.create(
        user=user,
        type='course',
        title='Kursga yozildingiz',
        message=f'Siz {course.title} kursiga muvaffaqiyatli yozildingiz.'
    )

@shared_task
def send_test_notification(user_id, test_id):
    """Test xabarnomasi"""
    user = User.objects.get(id=user_id)
    test = Test.objects.get(id=test_id)
    
    # Email yuborish
    send_mail(
        'Test yakunlandi',
        f'Salom {user.first_name}!\n\nSiz {test.title} testini muvaffaqiyatli yakunladingiz.',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
    
    # Xabarnoma yaratish
    Notification.objects.create(
        user=user,
        type='test',
        title='Test yakunlandi',
        message=f'Siz {test.title} testini muvaffaqiyatli yakunladingiz.'
    )

@shared_task
def send_payment_notification(user_id, payment_id):
    """To'lov xabarnomasi"""
    user = User.objects.get(id=user_id)
    payment = Payment.objects.get(id=payment_id)
    
    # Email yuborish
    send_mail(
        'To\'lov yakunlandi',
        f'Salom {user.first_name}!\n\nSiz {payment.amount} miqdoridagi to\'lovni muvaffaqiyatli amalga oshirdingiz.',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
    
    # Xabarnoma yaratish
    Notification.objects.create(
        user=user,
        type='payment',
        title='To\'lov yakunlandi',
        message=f'Siz {payment.amount} miqdoridagi to\'lovni muvaffaqiyatli amalga oshirdingiz.'
    ) 