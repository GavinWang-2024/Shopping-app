import React, { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: number;
  start_price: number;
  end_time: string;
}

interface AuthContextType {
  authTokens?: { access: string };
  logoutUser?: () => void;
}

const CreateAuctionsPage: React.FC = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    stock: 1,
    start_price: 1,
    end_time: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products/auctions/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.authTokens?.access,
        }
      });
      if (response.status === 201) {
        navigate('/'); //make this to auction page when done
      } else {
        setError("Error creating auction");
      }
    } catch (error) {
      console.error("Error creating auction:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-[#f1f1df] rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Auction</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Regular Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="start_price" className="block text-sm font-medium text-gray-700 mb-1">Starting Bid Price:</label>
              <input
                type="number"
                id="start_price"
                name="start_price"
                value={formData.start_price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">Auction End Time:</label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center">
              <button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Create Auction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAuctionsPage;