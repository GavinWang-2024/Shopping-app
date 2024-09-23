import React, { useState, useContext, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface ProductFormData {
    name: string;
    description: string;
    price: string;
    stock: string;
}

interface ProductFormErrors {
    name?: string;
    description?: string;
    price?: string;
    stock?: string;
}

interface AuthContextType {
    authTokens?: {
        access: string;
    };
}

const CreateProductPage: React.FC = () => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const auth = useContext(AuthContext) as AuthContextType;
    const [errors, setErrors] = useState<ProductFormErrors>({});
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await fetch('http://127.0.0.1:8000/api/products/create/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + String(auth?.authTokens?.access),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            const data = await response.json();
            console.log('Product created:', data);
            navigate('/');
        } catch (error) {
            if (error instanceof Error) {
                try {
                    const errorData: ProductFormErrors = JSON.parse(error.message);
                    setErrors(errorData);
                } catch {
                    console.error('Error creating product:', error.message);
                }
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen flex items-center justify-center">
            <div className="bg-[#f1f1df] p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-black">Create Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateProductPage