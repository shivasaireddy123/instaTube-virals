from django.urls import path
from .views import (
    CartDetailView,
    CartAddItemView,
    CartUpdateItemView,
    CartRemoveItemView,
    CartClearView
)

urlpatterns = [
    path('', CartDetailView.as_view(), name='cart_detail'),
    path('add/', CartAddItemView.as_view(), name='cart_add'),
    path('items/<int:item_id>/', CartUpdateItemView.as_view(), name='cart_update_item'),
    path('items/<int:item_id>/remove/', CartRemoveItemView.as_view(), name='cart_remove_item'),
    path('clear/', CartClearView.as_view(), name='cart_clear'),
]
