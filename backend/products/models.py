from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=120)

    def __str__(self):
        return self.name

class Product(models.Model):
    product_id = models.CharField(max_length=64, unique=True)
    product_name = models.CharField(max_length=255)
    brand = models.CharField(max_length=120, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True)
    product_image = models.ImageField(upload_to='products/', blank=True, null=True)
    description = models.TextField(blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        indexes = [models.Index(fields=['product_name','brand'])]

    def __str__(self):
        return self.product_name
