from django.urls import path
from .views import (
    CheckoutView,
    CustomerOrderListView,
    CustomerOrderDetailView,
    CustomerOrderCancelView,
    SellerOrderItemsListView,
    SellerOrderItemUpdateView,
    AdminOrderListView,
    AdminOrderStatusUpdateView
)

urlpatterns = [
    # Customer
    path('checkout/', CheckoutView.as_view(), name='order_checkout'),
    path('my-orders/', CustomerOrderListView.as_view(), name='customer_orders'),
    path('my-orders/<int:pk>/', CustomerOrderDetailView.as_view(), name='customer_order_detail'),
    path('my-orders/<int:pk>/cancel/', CustomerOrderCancelView.as_view(), name='customer_order_cancel'),

    # Seller
    path('seller/items/', SellerOrderItemsListView.as_view(), name='seller_order_items'),
    path('seller/items/<int:pk>/status/', SellerOrderItemUpdateView.as_view(), name='seller_order_item_status'),

    # Admin
    path('admin/all/', AdminOrderListView.as_view(), name='admin_orders'),
    path('admin/<int:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin_order_status'),
]
