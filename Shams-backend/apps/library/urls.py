from django.urls import path
from .views import (
    BookListView,
    BookDetailView,
    BookPurchaseView,
    BookDownloadView,
    MyBooksListView
)

app_name = 'library'

urlpatterns = [
    # Book URLs
    path('', BookListView.as_view(), name='book-list'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('<int:pk>/purchase/', BookPurchaseView.as_view(), name='book-purchase'),
    path('<int:pk>/download/', BookDownloadView.as_view(), name='book-download'),
    path('my-books/', MyBooksListView.as_view(), name='my-books'),
] 