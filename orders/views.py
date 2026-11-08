from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    OrderItemSerializer,
    CheckoutSerializer,
    SellerOrderItemStatusSerializer,
    AdminOrderStatusSerializer
)
from cart.models import Cart
from products.models import Product
from accounts.permissions import IsAdminUserRole, IsSellerUser

class CheckoutView(APIView):
    """
    Atomic Checkout:
    Validates cart, verifies stock, decrements stock, snapshots prices into OrderItems,
    clears cart, and places the order with COD.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.prefetch_related('items__product').get(customer=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.select_related('product__seller').all()
        if not cart_items.exists():
            return Response({'error': 'Your cart is empty. Add products before checking out.'}, status=status.HTTP_400_BAD_REQUEST)

        shipping_name = serializer.validated_data['shipping_name']
        shipping_phone = serializer.validated_data['shipping_phone']
        shipping_address = serializer.validated_data['shipping_address']
        payment_method = serializer.validated_data['payment_method']

        try:
            with transaction.atomic():
                # Re-validate stock with lock
                total_amount = 0
                order_items_to_create = []

                for item in cart_items:
                    # Lock product record
                    product = Product.objects.select_for_update().get(id=item.product.id)
                    if product.stock < item.quantity:
                        raise ValueError(f"Insufficient stock for '{product.name}'. Only {product.stock} available.")

                    # Calculate price at checkout time
                    item_subtotal = product.price * item.quantity
                    total_amount += item_subtotal

                    # Deduct stock
                    product.stock -= item.quantity
                    product.save()

                    order_items_to_create.append({
                        'product': product,
                        'seller': product.seller,
                        'product_name': product.name,
                        'purchase_price': product.price,
                        'quantity': item.quantity,
                    })

                # Create Order
                order = Order.objects.create(
                    customer=request.user,
                    total_amount=total_amount,
                    shipping_name=shipping_name,
                    shipping_phone=shipping_phone,
                    shipping_address=shipping_address,
                    payment_method=payment_method,
                    order_status=Order.OrderStatus.PLACED
                )

                # Create OrderItems
                for item_data in order_items_to_create:
                    OrderItem.objects.create(
                        order=order,
                        product=item_data['product'],
                        seller=item_data['seller'],
                        product_name=item_data['product_name'],
                        purchase_price=item_data['purchase_price'],
                        quantity=item_data['quantity'],
                        fulfillment_status=OrderItem.FulfillmentStatus.PENDING
                    )

                # Clear cart
                cart.items.all().delete()

            return Response({
                'message': 'Order placed successfully!',
                'order': OrderSerializer(order, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f"Failed to place order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomerOrderListView(generics.ListAPIView):
    """
    List of orders placed by the authenticated customer.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).prefetch_related('items__product').order_by('-created_at')


class CustomerOrderDetailView(generics.RetrieveAPIView):
    """
    Order details for customer.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.role == 'ADMIN' or self.request.user.is_staff:
            return Order.objects.all().prefetch_related('items__product')
        return Order.objects.filter(customer=self.request.user).prefetch_related('items__product')


class CustomerOrderCancelView(APIView):
    """
    Customer cancels an order before shipment.
    Restores product inventory back to stock atomically.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, customer=request.user)

        if order.order_status in [Order.OrderStatus.SHIPPED, Order.OrderStatus.DELIVERED]:
            return Response(
                {'error': f"Cannot cancel Order #{order.order_number} because it has already been {order.order_status.lower()}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.order_status == Order.OrderStatus.CANCELLED:
            return Response(
                {'error': f"Order #{order.order_number} is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Restore stock for each item in the order
                for item in order.items.select_related('product').all():
                    if item.product and item.fulfillment_status != OrderItem.FulfillmentStatus.CANCELLED:
                        product = Product.objects.select_for_update().get(id=item.product.id)
                        product.stock += item.quantity
                        product.save()
                    item.fulfillment_status = OrderItem.FulfillmentStatus.CANCELLED
                    item.save()

                order.order_status = Order.OrderStatus.CANCELLED
                order.save()

            return Response({
                'message': f"Order #{order.order_number} has been cancelled and items returned to artisan stock.",
                'order': OrderSerializer(order, context={'request': request}).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f"Failed to cancel order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SellerOrderItemsListView(APIView):
    """
    List of order items belonging to the authenticated seller.
    """
    permission_classes = [permissions.IsAuthenticated, IsSellerUser]

    def get(self, request):
        items = OrderItem.objects.filter(seller=request.user).select_related('order', 'product').order_by('-order__created_at')
        serializer = OrderItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)


class SellerOrderItemUpdateView(APIView):
    """
    Seller updates fulfillment status for one of their order items.
    If cancelling, restores product inventory back to stock.
    """
    permission_classes = [permissions.IsAuthenticated, IsSellerUser]

    def patch(self, request, pk):
        item = get_object_or_404(OrderItem, pk=pk, seller=request.user)
        previous_status = item.fulfillment_status
        serializer = SellerOrderItemStatusSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            new_status = serializer.validated_data['fulfillment_status']
            with transaction.atomic():
                serializer.save()
                # If newly cancelled, restore product stock
                if new_status == OrderItem.FulfillmentStatus.CANCELLED and previous_status != OrderItem.FulfillmentStatus.CANCELLED:
                    if item.product:
                        product = Product.objects.select_for_update().get(id=item.product.id)
                        product.stock += item.quantity
                        product.save()

            return Response({
                'message': f"Fulfillment status updated to {item.fulfillment_status}.",
                'item': OrderItemSerializer(item, context={'request': request}).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminOrderListView(generics.ListAPIView):
    """
    Admin views all orders.
    """
    permission_classes = [IsAdminUserRole]
    serializer_class = OrderSerializer

    def get_queryset(self):
        status_param = self.request.query_params.get('status', None)
        qs = Order.objects.prefetch_related('items__product', 'items__seller').select_related('customer').order_by('-created_at')
        if status_param:
            qs = qs.filter(order_status=status_param.upper())
        return qs


class AdminOrderStatusUpdateView(APIView):
    """
    Admin updates overall order status.
    If cancelling, restores product inventory for all un-cancelled items.
    """
    permission_classes = [IsAdminUserRole]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        previous_status = order.order_status
        serializer = AdminOrderStatusSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            new_status = serializer.validated_data['order_status']
            with transaction.atomic():
                serializer.save()
                if new_status == Order.OrderStatus.CANCELLED and previous_status != Order.OrderStatus.CANCELLED:
                    for item in order.items.select_related('product').all():
                        if item.product and item.fulfillment_status != OrderItem.FulfillmentStatus.CANCELLED:
                            product = Product.objects.select_for_update().get(id=item.product.id)
                            product.stock += item.quantity
                            product.save()
                        item.fulfillment_status = OrderItem.FulfillmentStatus.CANCELLED
                        item.save()

            return Response({
                'message': f"Order #{order.order_number} status updated to {order.order_status}.",
                'order': OrderSerializer(order, context={'request': request}).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
