from django.urls import path
from . import views

urlpatterns = [
    path('sales/', views.SalesAnalyticsView.as_view(), name='analytics-sales'),
    path('best-selling/', views.BestSellingView.as_view(), name='analytics-best-selling'),
    path('customers/', views.CustomerStatsView.as_view(), name='analytics-customers'),
    path('coupons/', views.CouponUsageView.as_view(), name='analytics-coupons'),
]
