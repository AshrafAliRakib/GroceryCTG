from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('user-profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('addresses/', views.AddressListCreateView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address-detail'),
    path('addresses/<int:pk>/set-default/', views.SetDefaultAddressView.as_view(), name='set-default-address'),
    path('dashboard/', views.CustomerDashboardView.as_view(), name='customer-dashboard'),
    path('send-otp/', views.SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', views.VerifyOTPView.as_view(), name='verify_otp'),
    path('check-otp/', views.CheckOTPStatusView.as_view(), name='check_otp'),
]
