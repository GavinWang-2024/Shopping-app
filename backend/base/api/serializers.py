from rest_framework.serializers import ModelSerializer
from base.models import Product, CartItem, Auction
from rest_framework import serializers
from django.contrib.auth.models import User


class AuctionSerializer(ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    highest_bidder_username=serializers.CharField(source='highest_bidder.username',read_only=True)
    owner=serializers.CharField(source='product.owner.username',read_only=True)
    class Meta:
        model = Auction
        fields = '__all__'

class ProductSerializer(ModelSerializer):
    owner=serializers.PrimaryKeyRelatedField(read_only=True)
    owner_username=serializers.CharField(source='owner.username',read_only=True)
    createdAt=serializers.SerializerMethodField()
    auction=AuctionSerializer(read_only=True)
    is_auction=serializers.SerializerMethodField()
    class Meta:
        model=Product
        fields='__all__'
    def get_createdAt(self,obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
    
    def get_is_auction(self,obj):
        return obj.is_auction()
    
class CartItemSerializer(ModelSerializer):
    product_name=serializers.CharField(source='product.name',read_only=True)
    product_description=serializers.CharField(source='product.description',read_only=True)
    product_price=serializers.CharField(source='product.price',read_only=True)
    class Meta:
        model=CartItem
        fields='__all__'
    
class UserCreationSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    name=serializers.CharField()
    description=serializers.CharField()
    price=serializers.DecimalField(max_digits=10,decimal_places=2)
    created_at=serializers.DateTimeField()
    is_auction=serializers.BooleanField()
    auction_details=AuctionSerializer(read_only=True,allow_null=True)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=('username','email','password')
    def create(self,validated_data):
        user=User(username=validated_data['username'],email=validated_data['email'],)
        user.set_password(validated_data['password'])
        user.save()
        return user