from django.urls import path
from . import views

app_name = 'library'

urlpatterns = [
    # Book URLs
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('books/<uuid:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('books/<uuid:pk>/purchase/', views.BookPurchaseView.as_view(), name='book-purchase'),
    path('books/<uuid:pk>/download/', views.BookDownloadView.as_view(), name='book-download'),
    
    # My Books URL
    path('my-books/', views.MyBooksListView.as_view(), name='my-books'),
] 