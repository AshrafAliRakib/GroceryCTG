from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, F
from orders.models import Order, OrderItem
from django.contrib.auth import get_user_model
from coupons.models import Coupon
from products.models import Product
from django.utils import timezone
from datetime import timedelta


class SalesAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_staff or user.role == 'owner'):
            return Response({'detail': 'Not authorized'}, status=403)

        now = timezone.now()
        day_ago = now - timedelta(days=1)
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        daily = Order.objects.filter(created_at__gte=day_ago).aggregate(total=Sum('order_total'))['total'] or 0
        weekly = Order.objects.filter(created_at__gte=week_ago).aggregate(total=Sum('order_total'))['total'] or 0
        monthly = Order.objects.filter(created_at__gte=month_ago).aggregate(total=Sum('order_total'))['total'] or 0

        return Response({'daily_revenue': daily, 'weekly_revenue': weekly, 'monthly_revenue': monthly})


class BestSellingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_staff or user.role == 'owner'):
            return Response({'detail': 'Not authorized'}, status=403)

        qs = OrderItem.objects.values('product__id','product__product_name').annotate(sold=Sum('quantity')).order_by('-sold')[:10]
        return Response(list(qs))


class CustomerStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_staff or user.role == 'owner'):
            return Response({'detail': 'Not authorized'}, status=403)

        User = get_user_model()
        total_customers = User.objects.filter(role='customer').count()
        total_orders = Order.objects.count()
        avg_orders_per_customer = total_orders / total_customers if total_customers else 0
        return Response({'total_customers': total_customers, 'total_orders': total_orders, 'avg_orders_per_customer': avg_orders_per_customer})


class CouponUsageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_staff or user.role == 'owner'):
            return Response({'detail': 'Not authorized'}, status=403)

        qs = Coupon.objects.all().values('coupon_code','used_count','usage_limit')
        return Response(list(qs))
