from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Product
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductApprovalSerializer
)
from accounts.permissions import (
    IsAdminUserRole,
    IsSellerUser,
    IsApprovedSeller,
    IsProductOwnerOrAdmin
)

class MarketplaceProductListView(generics.ListAPIView):
    """
    Marketplace listing for approved products.
    GUEST ACCESS STRICTLY DENIED: Must be authenticated.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductListSerializer

    def get_queryset(self):
        qs = Product.objects.filter(status=Product.ProductStatus.APPROVED).select_related('seller', 'category')

        # Search
        q = self.request.query_params.get('q', '').strip()
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q) | Q(category__name__icontains=q))

        # Category
        category_id = self.request.query_params.get('category', None)
        if category_id:
            qs = qs.filter(category_id=category_id)

        # Price range
        min_price = self.request.query_params.get('min_price', None)
        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # In stock only
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock in ['true', '1', 'True']:
            qs = qs.filter(stock__gt=0)

        # Sorting
        sort_by = self.request.query_params.get('sort', '-created_at')
        if sort_by == 'price_asc':
            qs = qs.order_by('price')
        elif sort_by == 'price_desc':
            qs = qs.order_by('-price')
        elif sort_by == 'name':
            qs = qs.order_by('name')
        else:
            qs = qs.order_by('-created_at')

        return qs


class MarketplaceProductDetailView(generics.RetrieveAPIView):
    """
    Product details.
    GUEST ACCESS STRICTLY DENIED: Must be authenticated.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.is_staff:
            return Product.objects.all().select_related('seller', 'category')
        if user.role == 'SELLER':
            return Product.objects.filter(Q(status=Product.ProductStatus.APPROVED) | Q(seller=user)).select_related('seller', 'category')
        return Product.objects.filter(status=Product.ProductStatus.APPROVED).select_related('seller', 'category')


class SellerProductListCreateView(APIView):
    """
    Seller product management:
    - GET: list seller's own products
    - POST: add new product (requires approved seller status)
    """
    permission_classes = [permissions.IsAuthenticated, IsSellerUser]

    def get(self, request):
        products = Product.objects.filter(seller=request.user).select_related('category', 'seller')
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        # Verify seller approval
        seller_profile = getattr(request.user, 'seller_profile', None)
        if not seller_profile or seller_profile.approval_status != 'APPROVED':
            return Response(
                {'error': 'Your seller account has not been approved yet. Only approved sellers can list products.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProductCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save(
                seller=request.user,
                status=Product.ProductStatus.PENDING # Needs admin approval
            )
            return Response(
                ProductDetailSerializer(product, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SellerProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Seller retrieves, modifies, or deletes their own product.
    Cannot edit another seller's product.
    """
    permission_classes = [permissions.IsAuthenticated, IsProductOwnerOrAdmin]
    serializer_class = ProductCreateUpdateSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.is_staff:
            return Product.objects.all()
        return Product.objects.filter(seller=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ProductDetailSerializer(instance, context={'request': request})
        return Response(serializer.data)

    def perform_update(self, serializer):
        # When a seller edits a product, reset to PENDING for review unless user is admin
        if self.request.user.role != 'ADMIN':
            serializer.save(status=Product.ProductStatus.PENDING)
        else:
            serializer.save()


class AdminProductListView(generics.ListAPIView):
    """
    Admin views all products across the marketplace.
    """
    permission_classes = [IsAdminUserRole]
    serializer_class = ProductListSerializer

    def get_queryset(self):
        status_param = self.request.query_params.get('status', None)
        qs = Product.objects.all().select_related('seller', 'category').order_by('-created_at')
        if status_param:
            qs = qs.filter(status=status_param.upper())
        return qs


class AdminProductApprovalView(APIView):
    """
    Admin approves or rejects a product.
    """
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductApprovalSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': f"Product '{product.name}' is now {product.status}.",
                'product': ProductDetailSerializer(product, context={'request': request}).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
