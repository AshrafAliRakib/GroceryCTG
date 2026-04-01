from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer
from django.utils import timezone
from decimal import Decimal


class CouponListCreateView(generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]


class CouponApplyView(generics.GenericAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    lookup_field = 'coupon_code'
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        coupon = self.get_object()
        if coupon.expiry_date < timezone.now() or coupon.used_count >= coupon.usage_limit:
            return Response({'detail': 'Coupon invalid or expired'}, status=status.HTTP_400_BAD_REQUEST)

        total = request.data.get('total')
        if total is None:
            return Response({'detail': 'total is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            total = Decimal(str(total))
        except Exception:
            return Response({'detail': 'invalid total'}, status=status.HTTP_400_BAD_REQUEST)

        if coupon.discount_type == 'percent':
            discount_amount = (total * Decimal(coupon.discount_value) / Decimal('100')).quantize(Decimal('0.01'))
        else:
            discount_amount = Decimal(coupon.discount_value)

        discounted_total = max(Decimal('0.00'), total - discount_amount)

        return Response({
            'coupon_code': coupon.coupon_code,
            'discount_amount': str(discount_amount),
            'discounted_total': str(discounted_total),
            'expiry_date': coupon.expiry_date,
            'used_count': coupon.used_count,
            'usage_limit': coupon.usage_limit,
        })
