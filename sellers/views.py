from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SellerProfile
from .serializers import SellerProfileSerializer, SellerApprovalUpdateSerializer
from accounts.permissions import IsAdminUserRole, IsSellerUser

class SellerMyProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsSellerUser]

    def get(self, request):
        profile, _ = SellerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'business_name': f"{request.user.first_name}'s Store",
                'phone': request.user.phone or '',
                'business_address': 'Address to be updated'
            }
        )
        serializer = SellerProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = getattr(request.user, 'seller_profile', None)
        if not profile:
            return Response({'error': 'Seller profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Allow updating business information, but NOT approval_status
        data = request.data.copy()
        data.pop('approval_status', None)
        serializer = SellerProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminSellerListView(generics.ListAPIView):
    permission_classes = [IsAdminUserRole]
    serializer_class = SellerProfileSerializer

    def get_queryset(self):
        status_param = self.request.query_params.get('status', None)
        qs = SellerProfile.objects.select_related('user').all().order_by('-created_at')
        if status_param:
            qs = qs.filter(approval_status=status_param.upper())
        return qs


class AdminSellerApprovalView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        try:
            seller_profile = SellerProfile.objects.get(pk=pk)
        except SellerProfile.DoesNotExist:
            return Response({'error': 'Seller profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SellerApprovalUpdateSerializer(seller_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': f"Seller '{seller_profile.business_name}' status updated to {seller_profile.approval_status}.",
                'seller': SellerProfileSerializer(seller_profile).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
