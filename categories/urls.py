from django.urls import path
from .views import CategoryListView, CategoryCreateView, CategoryDetailView

urlpatterns = [
    path('', CategoryListView.as_view(), name='category_list'),
    path('create/', CategoryCreateView.as_view(), name='category_create'),
    path('<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),
]
