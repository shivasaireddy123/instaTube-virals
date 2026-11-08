from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Address, CustomerProfile
from sellers.models import SellerProfile

User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'full_name', 'phone', 'street_address', 'city', 'state', 'pincode', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['phone', 'address', 'created_at']


class SellerProfileSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['id', 'business_name', 'business_description', 'phone', 'business_address', 'approval_status', 'rejection_reason', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    seller_profile = SellerProfileSummarySerializer(read_only=True)
    customer_profile = CustomerProfileSerializer(read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'phone', 'is_seller', 'is_customer', 'is_admin_user',
            'seller_profile', 'customer_profile', 'addresses'
        ]
        read_only_fields = ['id', 'is_seller', 'is_customer', 'is_admin_user']


class CustomerRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=25, required=False, allow_blank=True, default='')
    address = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        name = validated_data['name']
        phone = validated_data.get('phone', '')
        address = validated_data.get('address', '')

        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name,
            role=User.Role.CUSTOMER,
            phone=phone
        )
        CustomerProfile.objects.create(
            user=user,
            phone=phone,
            address=address
        )
        if address:
            Address.objects.create(
                customer=user,
                full_name=name,
                phone=phone,
                street_address=address,
                city='Default City',
                state='Default State',
                pincode='000000',
                is_default=True
            )
        return user


class SellerRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=25)
    business_name = serializers.CharField(max_length=200)
    business_description = serializers.CharField(required=False, allow_blank=True, default='')
    business_address = serializers.CharField()

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        name = validated_data['name']
        phone = validated_data['phone']
        business_name = validated_data['business_name']
        business_description = validated_data.get('business_description', '')
        business_address = validated_data['business_address']

        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=name,
            role=User.Role.SELLER,
            phone=phone
        )
        SellerProfile.objects.create(
            user=user,
            business_name=business_name,
            business_description=business_description,
            phone=phone,
            business_address=business_address,
            approval_status=SellerProfile.ApprovalStatus.PENDING
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'phone']
