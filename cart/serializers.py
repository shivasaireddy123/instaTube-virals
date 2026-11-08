from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product

class CartItemProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'image', 'seller_name']

    def get_seller_name(self, obj):
        if hasattr(obj.seller, 'seller_profile'):
            return obj.seller.seller_profile.business_name
        return obj.seller.first_name

    def get_image(self, obj):
        request = self.context.get('request', None)
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or ''


class CartItemSerializer(serializers.ModelSerializer):
    product = CartItemProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(status=Product.ProductStatus.APPROVED),
        write_only=True,
        source='product'
    )
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']
        read_only_fields = ['id', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'total_items', 'updated_at']
        read_only_fields = ['id', 'total_price', 'total_items', 'updated_at']
