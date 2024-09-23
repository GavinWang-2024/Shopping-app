import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface CartItem {
  id: number;
  product: number;
  quantity: number;
  product_name: string;
  product_description: string;
  product_price: number;
}

interface AuthContextType {
  authTokens?: { access: string };
  logoutUser?: () => void;
}

const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    getCart();
  }, [])

  const getCart = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access),
        },
      })
      const data = await response.json();
      if (response.status === 200) {
        setItems(data)
      } else if (response.statusText === "Unauthorized") {
        auth?.logoutUser?.();
      }
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    } finally {
      setLoading(false);
    }
  }

  const deleteCartItem = async (productId: number) => {
    try {
      const response = await fetch('http://localhost:8000/api/cart/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access),
        },
        body: JSON.stringify({ product_id: productId }),
      });
      if (response.status === 204) {
        setItems(items.filter(item => item.product !== productId));
      } else if (response.statusText === "Unauthorized") {
        auth?.logoutUser?.();
      } else {
        console.error("Failed to delete cart item");
      }
    } catch (error) {
      console.error("Error deleting cart item", error);
    }
  }

  const updateQuantity = async (productId: number) => {
    const newQuantity = parseInt(quantities[productId]);
    if (isNaN(newQuantity) || newQuantity < 1) {
      console.error("Invalid quantity");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/cart/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access),
        },
        body: JSON.stringify({ product_id: productId, quantity: newQuantity }),
      });
      if (response.status === 200) {
        const updatedItem = await response.json();
        setItems(items.map(item => item.product === productId ? { ...item, quantity: updatedItem.quantity } : item));
      } else if (response.statusText === "Unauthorized") {
        auth?.logoutUser?.();
      } else {
        console.error("Failed to update cart item quantity");
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  }

  const handleQuantityChange = (productId: number, value: string) => {
    setQuantities({ ...quantities, [productId]: value });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-blue-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-[#f1f1df] rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Cart</h2>
          {items.length === 0 ? (
            <p className="text-center text-gray-600 text-xl">Your cart is empty.</p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{item.product_name}</h3>
                    <p className="text-lg font-bold text-green-600">${Number(item.product_price).toFixed(2)}</p>
                  </div>
                  <p className="text-gray-600 mb-4">Quantity: {item.quantity}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <input
                      type="number"
                      value={quantities[item.product] || ''}
                      onChange={(e) => handleQuantityChange(item.product, e.target.value)}
                      min="1"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => updateQuantity(item.product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                    >
                      Update Quantity
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/products/${item.product}`}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => deleteCartItem(item.product)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                    >
                      Remove from Cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage;