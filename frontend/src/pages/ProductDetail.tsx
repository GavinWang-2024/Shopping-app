import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    owner_username: string;
    rating: number;
    createdAt: string;
}

interface AuthContextType {
    authTokens?: { access: string };
    logoutUser?: () => void;
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const auth = useContext(AuthContext) as AuthContextType;

    useEffect(() => {
        getProduct();
    }, [id]);

    const getProduct = async () => {
        if (!id) return;
        console.log("Getting product");
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.authTokens?.access,
                },
            });
            setProduct(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                auth.logoutUser?.();
            } else {
                console.error("Error fetching product:", error);
                setError("Failed to fetch product details. Please try again later.");
            }
        }
    };

    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
    if (!product) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#f5f5dc]'>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-6">Product Details</h1>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                    <div className="p-6">
                        <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">Price:</span>
                                <span className="text-green-600 text-xl">
                                    ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">Stock:</span>
                                <span>{product.stock} units</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">Owner:</span>
                                <span>{product.owner_username}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">Rating:</span>
                                <span>{product.rating} / 5</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">Created on: {new Date(product.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;