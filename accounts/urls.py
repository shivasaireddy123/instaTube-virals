from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterCustomerView,
    RegisterSellerView,
    UserProfileView,
    AddressListCreateView,
    AddressDetailView,
    AdminUsersListView
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/customer/', RegisterCustomerView.as_view(), name='register_customer'),
    path('register/seller/', RegisterSellerView.as_view(), name='register_seller'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('addresses/', AddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address_detail'),
    path('admin/users/', AdminUsersListView.as_view(), name='admin_users_list'),
]
