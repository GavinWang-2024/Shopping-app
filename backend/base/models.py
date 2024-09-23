from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.
class Product(models.Model):
    name=models.CharField(max_length=255)
    description=models.TextField()
    price=models.DecimalField(max_digits=10,decimal_places=2)
    stock=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now=True)
    isActive=models.BooleanField(default=True)
    rating=models.DecimalField(max_digits=3,decimal_places=2,default=0.0)
    owner=models.ForeignKey(User,on_delete=models.CASCADE,related_name="products")
    def __str__(self):
        return self.name[0:50]
    def is_auction(self):
        return hasattr(self,'auction') and self.auction.is_active

class Cart(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="cart")
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Cart for {self.user.username}"

class CartItem(models.Model):
    cart=models.ForeignKey(Cart,on_delete=models.CASCADE,related_name="items")
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name="cart_items")
    quantity=models.PositiveIntegerField(default=1)
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart}"
    
class Auction(models.Model):
    product=models.OneToOneField(Product,on_delete=models.CASCADE,related_name="auction")
    start_price=models.DecimalField(max_digits=10,decimal_places=2)
    current_price=models.DecimalField(max_digits=10,decimal_places=2)
    start_time=models.DateTimeField(default=timezone.now)
    end_time=models.DateTimeField()
    is_active=models.BooleanField(default=True)
    highest_bidder=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name="won_auctions")
    def __str__(self):
        return f"Auction for {self.product.name}"