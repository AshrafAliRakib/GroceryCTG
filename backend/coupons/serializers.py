from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ('id','coupon_code','discount_type','discount_value','expiry_date','usage_limit','used_count')
