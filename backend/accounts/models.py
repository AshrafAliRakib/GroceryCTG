from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string

class User(AbstractUser):
    PHONE = models.CharField(max_length=20, blank=True, null=True)
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('owner', 'Owner'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    is_verified = models.BooleanField(default=False)  # Email/Phone verified

    def __str__(self):
        return self.username or self.email


class OTP(models.Model):
    OTP_TYPE_CHOICES = (
        ('email', 'Email'),
        ('phone', 'Phone'),
    )
    
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    otp_code = models.CharField(max_length=6)
    otp_type = models.CharField(max_length=10, choices=OTP_TYPE_CHOICES, default='email')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=5)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.otp_type}:{self.email or self.phone}'
    
    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP code"""
        return ''.join(random.choices(string.digits, k=6))
    
    @staticmethod
    def create_otp(email=None, phone=None, otp_type='email'):
        """Create a new OTP record"""
        otp_code = OTP.generate_otp()
        expires_at = timezone.now() + timedelta(minutes=5)  # OTP valid for 5 minutes (faster)
        
        otp = OTP.objects.create(
            email=email or '',
            phone=phone or '',
            otp_code=otp_code,
            otp_type=otp_type,
            expires_at=expires_at
        )
        return otp
    
    def is_valid(self):
        """Check if OTP is still valid"""
        return timezone.now() <= self.expires_at and not self.is_verified and self.attempts < self.max_attempts
    
    def verify(self, code):
        """Verify OTP code"""
        self.attempts += 1
        self.save()
        
        if not self.is_valid():
            return False
        
        if self.otp_code == code:
            self.is_verified = True
            self.save()
            return True
        
        return False


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    default_address = models.ForeignKey('Address', on_delete=models.SET_NULL, null=True, blank=True, related_name='default_for_users')
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Address(models.Model):
    LABEL_CHOICES = (
        ('home', 'Home'),
        ('office', 'Office'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=20, choices=LABEL_CHOICES, default='home')
    address_line = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_default', '-created_at']
        unique_together = ['user', 'is_default']  # Ensure only one default address per user

    def __str__(self):
        return f"{self.user.username} - {self.label}"

    def save(self, *args, **kwargs):
        if self.is_default:
            # Set all other addresses for this user to not default
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
