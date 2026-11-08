import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from products.models import Product
from orders.models import Order, OrderItem
from cart.models import Cart

User = get_user_model()
client = APIClient()

print("--- TESTING PRODUCT / ORDER CANCELLATION & STOCK RESTORATION ---")

# Login customer
login_res = client.post('/api/accounts/login/', {
    'email': 'customer@instatube.com',
    'password': 'Customer@12345'
})
assert login_res.status_code == 200
token = login_res.data['access']
client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

# Pick an approved product
product = Product.objects.filter(status='APPROVED', stock__gte=5).first()
initial_stock = product.stock
print(f"Selected product: '{product.name}' with initial stock: {initial_stock}")

# Clear cart and add 3 items
client.post('/api/cart/clear/')
client.post('/api/cart/add/', {'product_id': product.id, 'quantity': 3})

# Checkout
checkout_res = client.post('/api/orders/checkout/', {
    'shipping_name': 'Aria Montgomery',
    'shipping_phone': '+1 555-0165',
    'shipping_address': '742 Evergreen Terrace',
    'payment_method': 'COD'
})
assert checkout_res.status_code == 201
order_id = checkout_res.data['order']['id']
order_number = checkout_res.data['order']['order_number']

# Check stock decreased
product.refresh_from_db()
assert product.stock == initial_stock - 3, f"Stock after order should be {initial_stock - 3}, got {product.stock}"
print(f"Order #{order_number} created. Stock correctly decremented to {product.stock}.")

# Now cancel the order
cancel_res = client.post(f'/api/orders/my-orders/{order_id}/cancel/')
assert cancel_res.status_code == 200, f"Cancel order failed: {cancel_res.data}"
assert cancel_res.data['order']['order_status'] == 'CANCELLED'
print(f"Order #{order_number} successfully cancelled.")

# Verify stock is restored
product.refresh_from_db()
assert product.stock == initial_stock, f"Stock should be restored to {initial_stock}, got {product.stock}"
print(f"Verified stock restored back to {product.stock} units.")

# Verify cannot re-cancel already cancelled order
re_cancel_res = client.post(f'/api/orders/my-orders/{order_id}/cancel/')
assert re_cancel_res.status_code == 400
print("Verified duplicate cancellation is rejected.")

print("\n--- PRODUCT CANCELLATION FEATURE VERIFIED SUCCESSFULLY! ---")
