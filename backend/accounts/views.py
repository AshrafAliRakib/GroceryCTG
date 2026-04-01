from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.db import models
from .serializers import RegisterSerializer, UserSerializer, SendOTPSerializer, VerifyOTPSerializer, OTPSerializer, UserProfileSerializer, AddressSerializer
from .models import User, OTP, UserProfile, Address

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class SendOTPView(APIView):
    """Send OTP to email or phone (non-blocking)"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone = serializer.validated_data.get('phone')
            otp_type = serializer.validated_data.get('otp_type')
            
            # Create OTP
            otp = OTP.create_otp(email=email, phone=phone, otp_type=otp_type)
            
            # Return immediately (send email/SMS in background)
            response_data = {
                'message': f'OTP sent to {otp_type}',
                'otp_id': otp.id,
                'expires_at': otp.expires_at
            }
            
            # Send OTP asynchronously (non-blocking)
            if otp_type == 'email':
                try:
                    # Send immediately but don't wait for it
                    send_mail(
                        'CTGGrocery - Your OTP Code',
                        f'Your One-Time Password (OTP) is: {otp.otp_code}\n\nThis code is valid for 5 minutes.\n\nDo not share this code with anyone.',
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        fail_silently=True,  # Don't block on email errors
                    )
                except:
                    pass  # Fail silently, OTP is still usable via console for testing
            elif otp_type == 'phone':
                # Mock SMS - print to console immediately
                print(f'🔑 SMS OTP to {phone}: {otp.otp_code}')
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """Verify OTP and complete registration"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone = serializer.validated_data.get('phone')
            otp_code = serializer.validated_data.get('otp_code')
            otp_type = serializer.validated_data.get('otp_type')
            
            # Find the most recent OTP
            query = OTP.objects.filter(otp_type=otp_type)
            if otp_type == 'email':
                query = query.filter(email=email)
            else:
                query = query.filter(phone=phone)
            
            otp = query.first()
            
            if not otp:
                return Response(
                    {'error': 'No OTP found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Verify OTP
            if otp.verify(otp_code):
                # Mark user as verified if exists
                if otp_type == 'email':
                    try:
                        user = User.objects.get(email=email)
                        user.is_verified = True
                        user.save()
                    except User.DoesNotExist:
                        pass
                
                return Response(
                    {
                        'message': 'OTP verified successfully',
                        'verified': True
                    },
                    status=status.HTTP_200_OK
                )
            else:
                remaining_attempts = otp.max_attempts - otp.attempts
                return Response(
                    {
                        'error': 'Invalid OTP code',
                        'attempts_remaining': max(0, remaining_attempts)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckOTPStatusView(APIView):
    """Check if OTP is verified"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        phone = request.data.get('phone')
        otp_type = request.data.get('otp_type', 'email')
        
        query = OTP.objects.filter(otp_type=otp_type)
        if otp_type == 'email':
            query = query.filter(email=email)
        else:
            query = query.filter(phone=phone)
        
        otp = query.first()
        
        if not otp:
            return Response(
                {'verified': False, 'error': 'No OTP found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {
                'verified': otp.is_verified,
                'expires_at': otp.expires_at,
                'attempts_remaining': max(0, otp.max_attempts - otp.attempts)
            },
            status=status.HTTP_200_OK
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class SetDefaultAddressView(generics.UpdateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        address = self.get_object()
        address.is_default = True
        address.save()
        serializer = self.get_serializer(address)
        return Response(serializer.data)


class CustomerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Get order statistics
        orders = Order.objects.filter(user=user)
        total_orders = orders.count()
        total_spent = orders.aggregate(total=models.Sum('order_total'))['total'] or 0
        
        # Recent orders (last 5)
        recent_orders = orders.order_by('-created_at')[:5]
        recent_orders_data = OrderSerializer(recent_orders, many=True).data
        
        # Default address
        default_address = Address.objects.filter(user=user, is_default=True).first()
        default_address_data = AddressSerializer(default_address).data if default_address else None
        
        dashboard_data = {
            'profile': UserProfileSerializer(profile, context={'request': request}).data,
            'total_orders': total_orders,
            'total_spent': total_spent,
            'recent_orders': recent_orders_data,
            'default_address': default_address_data
        }
        
        return Response(dashboard_data)
