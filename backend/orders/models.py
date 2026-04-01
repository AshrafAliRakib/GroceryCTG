from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    ORDER_STATUS = (
        ('pending','Pending'),
        ('processing','Processing'),
        ('shipped','Shipped'),
        ('delivered','Delivered'),
        ('cancelled','Cancelled'),
    )
    order_id = models.CharField(max_length=64, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)
    order_total = models.DecimalField(max_digits=12, decimal_places=2)
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_method = models.CharField(max_length=50)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
