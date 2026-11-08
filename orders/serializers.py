from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    seller_name = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'seller', 'seller_name', 'product_name',
            'product_image', 'purchase_price', 'quantity', 'fulfillment_status', 'subtotal'
        ]

    def get_seller_name(self, obj):
        if hasattr(obj.seller, 'seller_profile'):
            return obj.seller.seller_profile.business_name
        return obj.seller.first_name

    def get_product_image(self, obj):
        if obj.product:
            if obj.product.image:
                request = self.context.get('request', None)
                if request:
                    return request.build_absolute_uri(obj.product.image.url)
                return obj.product.image.url
            return obj.product.image_url or ''
        return ''


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_email = serializers.ReadOnlyField(source='customer.email')
    customer_name = serializers.ReadOnlyField(source='customer.first_name')

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_email', 'customer_name',
            'total_amount', 'shipping_name', 'shipping_phone',
            'shipping_address', 'payment_method', 'order_status',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['id', 'order_number', 'total_amount', 'created_at', 'updated_at']


class CheckoutSerializer(serializers.Serializer):
    shipping_name = serializers.CharField(max_length=150)
    shipping_phone = serializers.CharField(max_length=25)
    shipping_address = serializers.CharField()
    payment_method = serializers.ChoiceField(
        choices=Order.PaymentMethod.choices,
        default=Order.PaymentMethod.COD
    )


class SellerOrderItemStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['fulfillment_status']

    def validate_fulfillment_status(self, value):
        if value not in [
            OrderItem.FulfillmentStatus.PENDING,
            OrderItem.FulfillmentStatus.PROCESSING,
            OrderItem.FulfillmentStatus.SHIPPED,
            OrderItem.FulfillmentStatus.DELIVERED,
            OrderItem.FulfillmentStatus.CANCELLED
        ]:
            raise serializers.ValidationError("Invalid fulfillment status.")
        return value


class AdminOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_status']
