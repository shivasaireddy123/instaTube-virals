from rest_framework import generics, permissions
from .models import Category
from .serializers import CategorySerializer
from accounts.permissions import IsAdminUserRole

class CategoryListView(generics.ListAPIView):
    # Only authenticated users (Customers, Sellers, Admins) can fetch the dynamic categories
    permission_classes = [permissions.IsAuthenticated]
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer


class CategoryCreateView(generics.CreateAPIView):
    permission_classes = [IsAdminUserRole]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUserRole]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
