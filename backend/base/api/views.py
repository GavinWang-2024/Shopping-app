from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import ProductSerializer
from base.models import Product

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
    ]
    return Response(routes)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProducts(request, pk=None):
    user=request.user
    if pk is None:
        products=user.products.all()
        serializer=ProductSerializer(products,many=True)
        return Response(serializer.data)
    else:
        try:
            product=user.products.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error':'Product not found'},status=404)
        serializer=ProductSerializer(product)
        return Response(serializer.data)
        
            

