import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  isActive: boolean;
}

interface AuthContextType {
  authTokens?: { access: string };
}

const EditProductPage: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    isActive: true,
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        headers: {
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/edit/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access),
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const data = await response.json();
      console.log('Product updated:', data);
      navigate('/');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-[#f1f1df] rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price:</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock:</label>
              <input
                type="text"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProductPage;