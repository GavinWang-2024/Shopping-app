from django.urls import path
from rest_framework_simplejwt.views import (TokenRefreshView)
from . import views

urlpatterns=[
    path('',views.getRoutes),
    path('token/',views.MyTokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('products/',views.getProducts,name='products'),
    path('products/<str:pk>/', views.getProducts, name='product-detail'),
]