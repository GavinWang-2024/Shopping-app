https://github.com/user-attachments/assets/1781ae59-000b-4a0c-a516-cce9697ec136

# Shopping + Auction app


## About The Project

Allows users to create and manage products for sale, buy and sell products, and create auctions. 

### Features
- **User Authentication**: Secure user registration and login with JWT.
- **Cart**: Users add products they want to buy their cart where they can choose quantities, remove cart items, and give ratings.
- **Auction**: Users can create products they want to auction by giving a starting price and ending date.
- **Responsive App**: Mobile-friendly website.


### Tools
- Uses Django and Django rest framework to build a RESTful backend API
- React and TailwindCSS for responsive frontend
- simple_jwt to manage JWT authentication on backend and jwt-decode for frontend
- PostgreSQL database to store product, cart, user, cart item, and auction models
- Uses axios and fetch to communicate with backend



## Getting Started

### Installation

1. Clone the repo
```
  git https://github.com/GavinWang-2024/Shopping-app.git
  cd Shopping-app 
```
2. Download requirements and run servers
   ```
   pip install -r requirements.txt
   pip install --upgrade setuptools
   python manage.py migrate
   python manage.py runserver
    
   cd frontend
   npm install
   npm run dev
   ```

   
## Usage

1. Register or log in to your account.

2. Create products/buy products

3. Create/bid on auctions
