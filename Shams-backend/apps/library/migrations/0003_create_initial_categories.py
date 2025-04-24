from django.db import migrations

def create_initial_categories(apps, schema_editor):
    Category = apps.get_model('courses', 'Category')
    
    categories = [
        {
            'name': 'Programming',
            'slug': 'programming',
            'description': 'Programming related books'
        },
        {
            'name': 'AI',
            'slug': 'ai',
            'description': 'Artificial Intelligence related books'
        },
        {
            'name': 'Robotics',
            'slug': 'robotics',
            'description': 'Robotics related books'
        }
    ]
    
    for category_data in categories:
        Category.objects.get_or_create(
            slug=category_data['slug'],
            defaults=category_data
        )

def reverse_initial_categories(apps, schema_editor):
    Category = apps.get_model('courses', 'Category')
    Category.objects.filter(slug__in=['programming', 'ai', 'robotics']).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('library', '0002_alter_book_category'),
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_categories, reverse_initial_categories),
    ] 