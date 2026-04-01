from django.urls import path
from . import views

urlpatterns = [
    path('', views.CouponListCreateView.as_view(), name='coupon-list-create'),
    path('apply/<str:coupon_code>/', views.CouponApplyView.as_view(), name='coupon-apply'),
]
