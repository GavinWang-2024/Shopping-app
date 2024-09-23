from django.urls import path
from rest_framework_simplejwt.views import (TokenRefreshView)
from . import views

urlpatterns=[
    path('',views.getRoutes),
    path('token/',views.MyTokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('products/',views.getProducts,name='products'),
    path('products/<int:pk>/', views.getProducts, name='product-detail'),
    path('products/create/',views.createProduct, name='create-product'),
    path('products/<int:pk>/edit/', views.editProduct, name='edit-product'),
    path('products/<int:pk>/delete/', views.deleteProduct, name='delete-product'),
    path('cart/',views.CartView.as_view(),name='cart'),
    path('products/auctions/',views.AuctionView.as_view(), name='auctions'),
    path('products/auctions/<int:pk>/',views.AuctionView.as_view(), name='auctions-detail'),
    path('user/creations/',views.getUserCreations, name='user-creations'),
    path('register/',views.registerUser, name='register'),
]