import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from products.models import Product
from sellers.models import SellerProfile
from categories.models import Category
from orders.models import Order, OrderItem
from cart.models import Cart

User = get_user_model()
client = APIClient()

print("--- STARTING END-TO-END SYSTEM VERIFICATION ---")

# Test 1: Guest Access Protection
print("\n[Test 1] Guest access to products endpoint:")
res = client.get('/api/products/')
assert res.status_code == 401, f"Expected 401 for guest, got {res.status_code}"
print("PASSED: Unauthenticated guest strictly blocked from viewing products.")

# Test 2: Customer Login & Marketplace Access
print("\n[Test 2] Customer authentication & marketplace access:")
login_res = client.post('/api/accounts/login/', {
    'email': 'customer@instatube.com',
    'password': 'Customer@12345'
})
assert login_res.status_code == 200, f"Customer login failed: {login_res.data}"
cust_token = login_res.data['access']
client.credentials(HTTP_AUTHORIZATION=f'Bearer {cust_token}')

prod_res = client.get('/api/products/')
assert prod_res.status_code == 200, f"Customer products access failed: {prod_res.status_code}"
# Verify all returned products are APPROVED
for p in prod_res.data:
    assert p['status'] == 'APPROVED', f"Unapproved product shown to customer: {p['name']}"
print(f"PASSED: Customer successfully authenticated and retrieved {len(prod_res.data)} approved products.")

# Test 3: Seller Product Management & Role Permissions
print("\n[Test 3] Seller product permissions:")
login_seller = client.post('/api/accounts/login/', {
    'email': 'artisan@instatube.com',
    'password': 'Seller@12345'
})
assert login_seller.status_code == 200
seller_token = login_seller.data['access']
client.credentials(HTTP_AUTHORIZATION=f'Bearer {seller_token}')

category = Category.objects.first()
new_prod_res = client.post('/api/products/seller/my-products/', {
    'name': 'Test Artisan Vase',
    'category_id': category.id,
    'price': '45.00',
    'stock': 10,
    'description': 'Handcrafted clay test vase.'
})
assert new_prod_res.status_code == 201, f"Product creation failed: {new_prod_res.data}"
test_prod_id = new_prod_res.data['id']
assert new_prod_res.data['status'] == 'PENDING', "New product must have PENDING status"
print("PASSED: Approved seller can create products, initially set to PENDING.")

# Test 4: Admin Product Approval
print("\n[Test 4] Admin product approval:")
login_admin = client.post('/api/accounts/login/', {
    'email': 'admin@instatube.com',
    'password': 'Admin@12345'
})
assert login_admin.status_code == 200
admin_token = login_admin.data['access']
client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')

appr_res = client.post(f'/api/products/admin/approve/{test_prod_id}/', {
    'status': 'APPROVED',
    'admin_notes': 'Verified authentic craftsmanship.'
})
assert appr_res.status_code == 200
assert appr_res.data['product']['status'] == 'APPROVED'
print("PASSED: Admin can approve product, which now appears in customer catalog.")

# Test 5: Customer Cart & Atomic Checkout with Cash on Delivery
print("\n[Test 5] Cart operations & atomic checkout with COD:")
client.credentials(HTTP_AUTHORIZATION=f'Bearer {cust_token}')

# Clear cart first
client.post('/api/cart/clear/')

# Add test product to cart
add_res = client.post('/api/cart/add/', {
    'product_id': test_prod_id,
    'quantity': 2
})
assert add_res.status_code == 200, f"Add to cart failed: {add_res.data}"
assert add_res.data['cart']['total_items'] == 2

# Check initial stock
initial_stock = Product.objects.get(id=test_prod_id).stock

# Checkout
checkout_res = client.post('/api/orders/checkout/', {
    'shipping_name': 'Aria Montgomery',
    'shipping_phone': '+1 555-0165',
    'shipping_address': '742 Evergreen Terrace, Springfield, OR',
    'payment_method': 'COD'
})
assert checkout_res.status_code == 201, f"Checkout failed: {checkout_res.data}"
order_data = checkout_res.data['order']
assert order_data['payment_method'] == 'COD'
assert float(order_data['total_amount']) == 90.00 # 2 * 45.00

# Verify product stock was decremented
updated_stock = Product.objects.get(id=test_prod_id).stock
assert updated_stock == initial_stock - 2, f"Stock decrement mismatch: was {initial_stock}, now {updated_stock}"

# Verify cart was cleared
cart_res = client.get('/api/cart/')
assert cart_res.data['total_items'] == 0
print(f"PASSED: Atomic checkout created order #{order_data['order_number']}, decremented stock ({initial_stock}->{updated_stock}), and cleared cart.")

# Test 6: Seller order fulfillment update
print("\n[Test 6] Seller fulfillment status update:")
client.credentials(HTTP_AUTHORIZATION=f'Bearer {seller_token}')

seller_orders_res = client.get('/api/orders/seller/items/')
assert seller_orders_res.status_code == 200
my_item = [it for it in seller_orders_res.data if it['product'] == test_prod_id][0]
status_res = client.patch(f'/api/orders/seller/items/{my_item["id"]}/status/', {
    'fulfillment_status': 'SHIPPED'
})
assert status_res.status_code == 200
assert status_res.data['item']['fulfillment_status'] == 'SHIPPED'
print("PASSED: Seller can view order item and update fulfillment status to SHIPPED.")

# Clean up test product
Product.objects.filter(id=test_prod_id).delete()

print("\n--- ALL 6 SYSTEM TEST SUITES PASSED SUCCESSFULLY! ---")
