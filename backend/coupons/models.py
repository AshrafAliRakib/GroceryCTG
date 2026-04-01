from django.db import models

class Coupon(models.Model):
    coupon_code = models.CharField(max_length=64, unique=True)
    DISCOUNT_TYPES = (('percent','Percentage'), ('fixed','Fixed'))
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateTimeField()
    usage_limit = models.IntegerField(default=1)
    used_count = models.IntegerField(default=0)

    def __str__(self):
        return self.coupon_code
