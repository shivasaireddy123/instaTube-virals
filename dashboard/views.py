from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model
from sellers.models import SellerProfile
from products.models import Product
from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer, OrderItemSerializer
from products.serializers import ProductListSerializer
from sellers.serializers import SellerProfileSerializer
from accounts.permissions import IsAdminUserRole, IsSellerUser

User = get_user_model()

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        total_customers = User.objects.filter(role=User.Role.CUSTOMER).count()
        total_sellers = User.objects.filter(role=User.Role.SELLER).count()
        pending_sellers_count = SellerProfile.objects.filter(approval_status=SellerProfile.ApprovalStatus.PENDING).count()

        total_products = Product.objects.count()
        approved_products = Product.objects.filter(status=Product.ProductStatus.APPROVED).count()
        pending_products_count = Product.objects.filter(status=Product.ProductStatus.PENDING).count()

        total_orders = Order.objects.count()
        total_revenue = Order.objects.exclude(order_status=Order.OrderStatus.CANCELLED).aggregate(
            total=Sum('total_amount')
        )['total'] or 0

        recent_orders = Order.objects.prefetch_related('items__product').order_by('-created_at')[:5]
        pending_sellers = SellerProfile.objects.filter(
            approval_status=SellerProfile.ApprovalStatus.PENDING
        ).select_related('user').order_by('-created_at')[:5]
        pending_products = Product.objects.filter(
            status=Product.ProductStatus.PENDING
        ).select_related('seller', 'category').order_by('-created_at')[:5]

        return Response({
            'stats': {
                'total_customers': total_customers,
                'total_sellers': total_sellers,
                'pending_sellers_count': pending_sellers_count,
                'total_products': total_products,
                'approved_products': approved_products,
                'pending_products_count': pending_products_count,
                'total_orders': total_orders,
                'total_revenue': float(total_revenue),
            },
            'recent_orders': OrderSerializer(recent_orders, many=True, context={'request': request}).data,
            'pending_sellers': SellerProfileSerializer(pending_sellers, many=True).data,
            'pending_products': ProductListSerializer(pending_products, many=True, context={'request': request}).data
        })


class SellerDashboardStatsView(APIView):
    permission_classes = [IsSellerUser]

    def get(self, request):
        seller = request.user
        seller_profile = getattr(seller, 'seller_profile', None)

        products_qs = Product.objects.filter(seller=seller)
        total_products = products_qs.count()
        approved_products = products_qs.filter(status=Product.ProductStatus.APPROVED).count()
        pending_products = products_qs.filter(status=Product.ProductStatus.PENDING).count()
        rejected_products = products_qs.filter(status=Product.ProductStatus.REJECTED).count()

        seller_items = OrderItem.objects.filter(seller=seller)
        total_order_items = seller_items.count()
        unique_orders_count = seller_items.values('order').distinct().count()

        # Total revenue from items sold that aren't cancelled
        valid_items = seller_items.exclude(fulfillment_status=OrderItem.FulfillmentStatus.CANCELLED)
        total_revenue = sum(item.subtotal for item in valid_items)
        units_sold = sum(item.quantity for item in valid_items)

        recent_items = seller_items.select_related('order', 'product').order_by('-order__created_at')[:5]

        return Response({
            'seller_profile': {
                'business_name': seller_profile.business_name if seller_profile else seller.first_name,
                'approval_status': seller_profile.approval_status if seller_profile else 'PENDING',
                'rejection_reason': seller_profile.rejection_reason if seller_profile else '',
            },
            'stats': {
                'total_products': total_products,
                'approved_products': approved_products,
                'pending_products': pending_products,
                'rejected_products': rejected_products,
                'total_orders': unique_orders_count,
                'units_sold': units_sold,
                'total_revenue': float(total_revenue),
            },
            'recent_orders': OrderItemSerializer(recent_items, many=True, context={'request': request}).data
        })
