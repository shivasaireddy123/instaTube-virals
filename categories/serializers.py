from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'created_at', 'products_count']
        read_only_fields = ['id', 'slug', 'created_at']

    def get_products_count(self, obj):
        # Count only approved products in this category
        return obj.products.filter(status='APPROVED').count()
