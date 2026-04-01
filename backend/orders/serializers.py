from rest_framework import serializers
from .models import Order, OrderItem
from decimal import Decimal

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product','quantity','price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    coupon_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = ('order_id','user','order_total','order_status','created_at','updated_at','payment_method','items','coupon_code')
        read_only_fields = ('order_id','user','created_at','updated_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        coupon_code = validated_data.pop('coupon_code', '')
        order = Order.objects.create(**validated_data)
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        # Mark coupon as used if provided
        if coupon_code:
            from coupons.models import Coupon
            try:
                coupon = Coupon.objects.get(coupon_code=coupon_code)
                coupon.used_count += 1
                coupon.save()
            except Coupon.DoesNotExist:
                pass
        return order

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('order_status',)
