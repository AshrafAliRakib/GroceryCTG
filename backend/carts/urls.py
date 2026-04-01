from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartDetailView.as_view(), name='cart-detail'),
    path('add/', views.AddToCartView.as_view(), name='cart-add'),
    path('item/<int:item_id>/update/', views.UpdateCartItemView.as_view(), name='cart-item-update'),
    path('item/<int:item_id>/remove/', views.RemoveCartItemView.as_view(), name='cart-item-remove'),
]
