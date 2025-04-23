# Shams Academy Backend

## 🏛️ Texnologiyalar
- **Framework**: Django + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT + dj-rest-auth + allauth (Google, Facebook login)
- **Media Storage**: Cloudinary/Amazon S3
- **Chatbot**: OpenAI API
- **Email**: Django Email backend + Celery
- **Payments**: Payme, Click, Uzum (Webhook)
- **Security**: DRF permissions, throttling, XSS/CSRF protection
- **Optimization**: Pagination, Caching, Query optimization

## 🚀 O'rnatish

1. Virtual environment yaratish:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Kerakli paketlarni o'rnatish:
```bash
pip install -r requirements.txt
```

3. Environment variables:
```bash
cp .env.example .env
# .env faylini to'g'rilash
```

4. Migrations:
```bash
python manage.py migrate
```

5. Superuser yaratish:
```bash
python manage.py createsuperuser
```

6. Server ishga tushirish:
```bash
python manage.py runserver
```

## 📁 Loyiha tuzilishi

```
shams/
├── apps/                    # Django apps
│   ├── accounts/           # Foydalanuvchilar
│   ├── courses/            # Kurslar
│   ├── tests/              # Testlar
│   ├── library/            # Kutubxona
│   ├── payments/           # To'lovlar
│   └── chatbot/            # AI yordamchi
├── core/                   # Asosiy sozlamalar
├── utils/                  # Yordamchi funksiyalar
├── templates/              # HTML shablonlar
├── static/                 # Statik fayllar
└── media/                  # Media fayllar
```

## 🔒 Xavfsizlik

- JWT authentication
- CORS sozlamalari
- Rate limiting
- XSS/CSRF himoya
- Input validatsiya
- Secure headers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Ro'yxatdan o'tish
- `POST /api/auth/logout/` - Chiqish
- `POST /api/auth/password/reset/` - Parolni tiklash

### Courses
- `GET /api/courses/` - Kurslar ro'yxati
- `GET /api/courses/{id}/` - Kurs ma'lumotlari
- `POST /api/courses/{id}/enroll/` - Kursga yozilish

### Tests
- `GET /api/tests/` - Testlar ro'yxati
- `GET /api/tests/{id}/` - Test ma'lumotlari
- `POST /api/tests/{id}/submit/` - Test javoblari

### Library
- `GET /api/books/` - Kitoblar ro'yxati
- `GET /api/books/{id}/` - Kitob ma'lumotlari

### Payments
- `POST /api/payments/create/` - To'lov yaratish
- `POST /api/payments/webhook/` - Webhook

### Chatbot
- `POST /api/chatbot/message/` - AI yordamchiga xabar

## 🔄 CI/CD

- GitHub Actions
- Docker
- Nginx
- Gunicorn

## 📝 Lisensiya

MIT 