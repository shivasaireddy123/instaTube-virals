from rest_framework import serializers
from .models import Product
from categories.serializers import CategorySerializer
from categories.models import Category
from accounts.models import User

class SellerSummarySerializer(serializers.ModelSerializer):
    business_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'business_name']

    def get_business_name(self, obj):
        if hasattr(obj, 'seller_profile'):
            return obj.seller_profile.business_name
        return obj.first_name


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    seller = SellerSummarySerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'stock', 'image',
            'status', 'category', 'seller', 'created_at'
        ]

    def get_image(self, obj):
        request = self.context.get('request', None)
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or ''


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    seller = SellerSummarySerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock',
            'image', 'status', 'admin_notes', 'category', 'seller',
            'created_at', 'updated_at'
        ]

    def get_image(self, obj):
        request = self.context.get('request', None)
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or ''


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        required=False,
        allow_null=True
    )
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.URLField(required=False, allow_blank=True, default='')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock',
            'category_id', 'image', 'image_url'
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value


class ProductApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['status', 'admin_notes']

    def validate_status(self, value):
        if value not in [Product.ProductStatus.APPROVED, Product.ProductStatus.REJECTED]:
            raise serializers.ValidationError("Status must be APPROVED or REJECTED.")
        return value
