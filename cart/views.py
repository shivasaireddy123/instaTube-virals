from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product
from accounts.permissions import IsCustomerUser

def get_or_create_customer_cart(user):
    cart, _ = Cart.objects.get_or_create(customer=user)
    return cart


class CartDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_or_create_customer_cart(request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class CartAddItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            quantity = 1

        if quantity <= 0:
            return Response({'error': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id, status=Product.ProductStatus.APPROVED)

        if product.stock <= 0:
            return Response({'error': f"'{product.name}' is out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_customer_cart(request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response(
                    {'error': f"Cannot add {quantity} more. Only {product.stock} items available in stock."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
            cart_item.save()
        else:
            if cart_item.quantity > product.stock:
                cart_item.quantity = product.stock
                cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response({
            'message': f"Added '{product.name}' to cart.",
            'cart': serializer.data
        }, status=status.HTTP_200_OK)


class CartUpdateItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        try:
            quantity = int(request.data.get('quantity'))
        except (ValueError, TypeError):
            return Response({'error': 'A valid integer quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_customer_cart(request.user)
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

        if quantity <= 0:
            cart_item.delete()
            serializer = CartSerializer(cart, context={'request': request})
            return Response({
                'message': 'Item removed from cart.',
                'cart': serializer.data
            })

        if quantity > cart_item.product.stock:
            return Response(
                {'error': f"Only {cart_item.product.stock} items available in stock."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response({
            'message': 'Cart updated.',
            'cart': serializer.data
        })


class CartRemoveItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_or_create_customer_cart(request.user)
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
        except CartItem.DoesNotExist:
            pass

        serializer = CartSerializer(cart, context={'request': request})
        return Response({
            'message': 'Item removed from cart.',
            'cart': serializer.data
        })


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = get_or_create_customer_cart(request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response({
            'message': 'Cart cleared.',
            'cart': serializer.data
        })
