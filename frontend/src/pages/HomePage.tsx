import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
  owner_username: string;
  is_auction: boolean;
}

interface AuthContextType {
  authTokens?: {
    access: string;
  };
  user?: {
    username: string;
  };
  logoutUser: () => void;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext) as AuthContextType | null;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access)
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        const filteredProducts = data.filter((product: Product) => !product.is_auction);
        setProducts(filteredProducts);
      } else if (response.status === 401) {
        auth?.logoutUser();
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products.');
      console.error(err);
    }
  }

  const deleteProduct = async (productId: number) => {
    if (!auth || !auth.authTokens) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access)
        }
      });
      if (response.status === 204) {
        setProducts(products.filter(product => product.id !== productId));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  }

  // Define a fixed array of lighter shades
  const lightShades = [
    'bg-blue-300',  // Light Blue
    'bg-purple-300', // Light Purple
    'bg-green-300', // Light Green
    'bg-red-300'    // Light Red
  ];

  const getRandomLightShade = () => {
    return lightShades[Math.floor(Math.random() * lightShades.length)];
  };

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-900">
      <div className="container mx-auto px-20 py-8 bg-[#f1f1df] min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Product Showcase</h1>
        <div className="mb-8 text-center">
          <Link to="/products/create/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            Create New Product
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className={`${getRandomLightShade()} rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{product.name}</h2>
                <p className="text-gray-700 mb-3 h-12 overflow-hidden">
                  {product.description.length > 50
                    ? `${product.description.slice(0, 50)}...`
                    : product.description}
                </p>
                <p className="text-lg font-bold text-green-600 mb-4">${product.price}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/products/${product.id}/`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-full text-sm transition duration-300 ease-in-out">
                    View Details
                  </Link>
                  {!product.is_auction && (
                    <AddToCartButton 
                      productId={product.id} 
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-full text-sm transition duration-300 ease-in-out" 
                    />
                  )}
                  {auth?.user?.username === product.owner_username && (
                    <>
                      <Link to={`/products/${product.id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-full text-sm transition duration-300 ease-in-out">
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-full text-sm transition duration-300 ease-in-out"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
