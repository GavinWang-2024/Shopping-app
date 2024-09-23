from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.views import status
from .serializers import ProductSerializer, CartItemSerializer, AuctionSerializer, UserCreationSerializer, UserRegistrationSerializer
from base.models import Product, Cart, CartItem, Auction
from django.utils import timezone
from django.db.models import Prefetch
from itertools import chain

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes=[
        '/api/token/',
        '/api/token/refresh/',
        '/api/products/',
        '/api/cart/',
    ]
    return Response(routes)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProducts(request, pk=None):
    user=request.user
    if pk is None:
        products=Product.objects.all()
        serializer=ProductSerializer(products,many=True)
        return Response(serializer.data)
    else:
        try:
            product=Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error':'Product not found'},status=404)
        serializer=ProductSerializer(product)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProduct(request):
    print("Request received", request.data)
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        # Log the specific validation errors
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editProduct(request,pk):
    try:
        product=Product.objects.get(pk=pk,owner=request.user)
    except Product.DoesNotExist:
        return Response({'error':'Product not found'},status=status.HTTP_404_NOT_FOUND)
    serializer=ProductSerializer(product,data=request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteProduct(request,pk):
    try:
        product=Product.objects.get(pk=pk,owner=request.user)
    except Product.DoesNotExist:
        return Response({'error':'Product not found'},status=status.HTTP_404_NOT_FOUND)
    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
    
class CartView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        cart,created=Cart.objects.get_or_create(user=request.user)
        cart_items=CartItem.objects.filter(cart=cart)
        serializer=CartItemSerializer(cart_items,many=True)
        return Response(serializer.data)
    def post(self,request):
        product_id=request.data.get('product_id')
        quantity=request.data.get('quantity',1)
        try:
            product=Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error':'Product not found'},status=status.HTTP_404_NOT_FOUND)
        cart,created=Cart.objects.get_or_create(user=request.user)
        cart_item,created=CartItem.objects.get_or_create(cart=cart,product=product)
        if not created:
            cart_item.quantity+=quantity
        else:
            cart_item.quantity=quantity
        cart_item.save()
        serializer=CartItemSerializer(cart_item)
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    def put(self,request):
        product_id=request.data.get('product_id')
        quantity=request.data.get('quantity',1)
        try:
            cart=Cart.objects.get(user=request.user)
            cart_item=CartItem.objects.get(cart=cart,product_id=product_id)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response({'error':'Product not found in cart'},status=status.HTTP_404_NOT_FOUND)
        cart_item.quantity=int(quantity)
        cart_item.save()
        serializer=CartItemSerializer(cart_item)
        return Response(serializer.data)
    def delete(self,request):
        product_id=request.data.get('product_id')
        try:
            cart=Cart.objects.get(user=request.user)
            cart_item=CartItem.objects.get(cart=cart,product_id=product_id)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response({'error':'Product not found in cart'},status=status.HTTP_404_NOT_FOUND)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AuctionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_serializer = ProductSerializer(data=request.data)
        if product_serializer.is_valid():
            product = product_serializer.save(owner=request.user)

            auction_data = {
                'product': product.id,
                'start_price': request.data.get('start_price'),
                'current_price': request.data.get('start_price'),
                'end_time': request.data.get('end_time'),
            }
            auction_serializer = AuctionSerializer(data=auction_data)
            if auction_serializer.is_valid():
                auction_serializer.save()
                response_data = product_serializer.data
                response_data['auction'] = auction_serializer.data
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                product.delete()
                return Response(auction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request,pk=None):
        if pk is not None:
            try:
                auctions=Auction.objects.get(is_active=True,pk=pk)
                serializer=AuctionSerializer(auctions)
                return Response(serializer.data)
            except Auction.DoesNotExist:
                return Response({'error':'Auction not found'},status=status.HTTP_404_NOT_FOUND)
        else:
            auctions=Auction.objects.filter(is_active=True)
            serializer=AuctionSerializer(auctions,many=True)
            return Response(serializer.data)
        
    def put(self, request, pk):
        try:
            auction = Auction.objects.get(pk=pk, is_active=True)
        except Auction.DoesNotExist:
            return Response({'error': 'Auction not found'}, status=status.HTTP_404_NOT_FOUND)

        if auction.end_time <= timezone.now():
            auction.is_active = False
            auction.save()
            return Response({'error': 'Auction ended'}, status=status.HTTP_400_BAD_REQUEST)

        new_bid = request.data.get('bid')
        if not new_bid:
            return Response({'error': 'Bid amount must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_bid = float(new_bid)
        except ValueError:
            return Response({'error': 'Invalid bid amount'}, status=status.HTTP_400_BAD_REQUEST)

        if new_bid <= float(auction.current_price):
            return Response({'error': 'Bid amount must be higher than current price'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user == auction.product.owner:
            return Response({'error': 'You cannot bid on your own product'}, status=status.HTTP_400_BAD_REQUEST)

        auction.current_price = new_bid
        auction.highest_bidder = request.user
        auction.save()

        self.add_to_cart(request.user, auction.product)

        serializer = AuctionSerializer(auction)
        return Response(serializer.data)

    def add_to_cart(self, user, product):
        cart, created = Cart.objects.get_or_create(user=user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += 1
        else:
            cart_item.quantity = 1
        cart_item.save()
        
    def patch(self, request, pk):
        print(f"Received PATCH request for auction {pk}")
        try:
            auction = Auction.objects.get(pk=pk, is_active=True)
            print(f"Found auction: {auction}")
        except Auction.DoesNotExist:
            print(f"Auction {pk} not found or not active")
            return Response({'error': 'Auction not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if the requesting user is the owner
        if request.user != auction.product.owner:
            return Response({'error': 'You are not the owner of this auction'}, status=status.HTTP_403_FORBIDDEN)
        
        # Deactivate the auction
        auction.is_active = False
        auction.is_active = False
        try:
            auction.save()
            print(f"Auction {pk} successfully deactivated.")
        except Exception as e:
            print(f"Failed to deactivate auction {pk}: {str(e)}")
            return Response({'error': 'Failed to deactivate auction'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Auction has been deactivated'}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserCreations(request):
    user=request.user
    products=Product.objects.filter(owner=user).prefetch_related(Prefetch('auction',queryset=Auction.objects.all(),to_attr='auction_prefetched'))
    creations=[]
    for product in products:
        creation={
            'id':product.id,
            'name':product.name,
            'description':product.description,
            'price':product.price,
            'created_at':product.created_at,
            'is_auction':hasattr(product,'auction'),
            'auction_details': product.auction if hasattr(product, 'auction') else None
        }
        creations.append(creation)  
    creations.sort(key=lambda x: x['created_at'], reverse=True)
    serializer=UserCreationSerializer(creations,many=True)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    serializer=UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user=serializer.save()
        return Response({'username':user.username,'email':user.email},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)