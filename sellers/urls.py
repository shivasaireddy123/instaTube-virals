from django.urls import path
from .views import SellerMyProfileView, AdminSellerListView, AdminSellerApprovalView

urlpatterns = [
    path('profile/', SellerMyProfileView.as_view(), name='seller_my_profile'),
    path('admin/list/', AdminSellerListView.as_view(), name='admin_seller_list'),
    path('admin/approve/<int:pk>/', AdminSellerApprovalView.as_view(), name='admin_seller_approval'),
]
