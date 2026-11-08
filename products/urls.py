from django.urls import path
from .views import (
    MarketplaceProductListView,
    MarketplaceProductDetailView,
    SellerProductListCreateView,
    SellerProductDetailView,
    AdminProductListView,
    AdminProductApprovalView
)

urlpatterns = [
    # Marketplace (Customer)
    path('', MarketplaceProductListView.as_view(), name='marketplace_products'),
    path('<int:pk>/', MarketplaceProductDetailView.as_view(), name='product_detail'),

    # Seller management
    path('seller/my-products/', SellerProductListCreateView.as_view(), name='seller_products'),
    path('seller/my-products/<int:pk>/', SellerProductDetailView.as_view(), name='seller_product_detail'),

    # Admin management
    path('admin/all/', AdminProductListView.as_view(), name='admin_products'),
    path('admin/approve/<int:pk>/', AdminProductApprovalView.as_view(), name='admin_product_approval'),
]
