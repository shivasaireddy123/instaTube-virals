from django.urls import path
from .views import AdminDashboardStatsView, SellerDashboardStatsView

urlpatterns = [
    path('admin/', AdminDashboardStatsView.as_view(), name='admin_dashboard_stats'),
    path('seller/', SellerDashboardStatsView.as_view(), name='seller_dashboard_stats'),
]
