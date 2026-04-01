from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListView.as_view(), name='order-list'),
    path('create/', views.OrderCreateView.as_view(), name='order-create'),
    path('<str:order_id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<str:order_id>/status/', views.OrderStatusUpdateView.as_view(), name='order-status-update'),
    path('<str:order_id>/reorder/', views.ReorderView.as_view(), name='reorder'),
]
