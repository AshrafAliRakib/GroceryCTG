from rest_framework import serializers
from .models import User, OTP, UserProfile, Address
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','PHONE','role','is_verified')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username','email','password','phone')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=validated_data.get('password')
        )
        user.PHONE = validated_data.get('phone', '')
        user.is_verified = False
        user.save()
        return user


class SendOTPSerializer(serializers.Serializer):
    """Serializer to send OTP to email or phone"""
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    otp_type = serializers.ChoiceField(choices=['email', 'phone'])
    
    def validate(self, data):
        otp_type = data.get('otp_type')
        if otp_type == 'email' and not data.get('email'):
            raise serializers.ValidationError('Email is required for email OTP')
        if otp_type == 'phone' and not data.get('phone'):
            raise serializers.ValidationError('Phone is required for phone OTP')
        return data


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer to verify OTP and complete registration"""
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    otp_code = serializers.CharField(max_length=6, min_length=6)
    otp_type = serializers.ChoiceField(choices=['email', 'phone'])
    
    def validate(self, data):
        otp_type = data.get('otp_type')
        if otp_type == 'email' and not data.get('email'):
            raise serializers.ValidationError('Email is required')
        if otp_type == 'phone' and not data.get('phone'):
            raise serializers.ValidationError('Phone is required')
        return data


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ('id', 'otp_type', 'email', 'phone', 'is_verified', 'created_at', 'expires_at')


class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ('full_name', 'phone_number', 'profile_picture', 'profile_picture_url', 'default_address', 'city', 'postal_code', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
        return None


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'label', 'address_line', 'city', 'postal_code', 'is_default', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
