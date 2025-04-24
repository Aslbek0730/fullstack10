from django.db import migrations

def update_book_categories(apps, schema_editor):
    Book = apps.get_model('library', 'Book')
    Category = apps.get_model('courses', 'Category')
    
    # Get or create categories
    programming, _ = Category.objects.get_or_create(
        slug='programming',
        defaults={
            'name': 'Programming',
            'description': 'Programming related books'
        }
    )
    ai, _ = Category.objects.get_or_create(
        slug='ai',
        defaults={
            'name': 'AI',
            'description': 'Artificial Intelligence related books'
        }
    )
    robotics, _ = Category.objects.get_or_create(
        slug='robotics',
        defaults={
            'name': 'Robotics',
            'description': 'Robotics related books'
        }
    )
    
    # Update books
    Book.objects.filter(category__isnull=True).update(category=programming)

def reverse_book_categories(apps, schema_editor):
    Book = apps.get_model('library', 'Book')
    Book.objects.all().update(category=None)

class Migration(migrations.Migration):
    dependencies = [
        ('library', '0003_create_initial_categories'),
    ]

    operations = [
        migrations.RunPython(update_book_categories, reverse_book_categories),
    ] 