from rest_framework import serializers
from .models import SellerProfile
from accounts.models import User

class SellerUserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'date_joined']


class SellerProfileSerializer(serializers.ModelSerializer):
    user = SellerUserBasicSerializer(read_only=True)
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = SellerProfile
        fields = [
            'id', 'user', 'business_name', 'business_description',
            'phone', 'business_address', 'approval_status',
            'rejection_reason', 'created_at', 'updated_at', 'products_count'
        ]
        read_only_fields = ['id', 'approval_status', 'created_at', 'updated_at']

    def get_products_count(self, obj):
        return obj.user.products.count()


class SellerApprovalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['approval_status', 'rejection_reason']

    def validate_approval_status(self, value):
        if value not in [SellerProfile.ApprovalStatus.APPROVED, SellerProfile.ApprovalStatus.REJECTED]:
            raise serializers.ValidationError("Status must be either APPROVED or REJECTED.")
        return value
