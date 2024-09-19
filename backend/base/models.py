from django.db import models
from django.contrib.auth.models import User
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