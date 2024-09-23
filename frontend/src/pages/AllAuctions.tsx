import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Auction {
    id: number;
    product_name: string;
    current_price: number | string;
    end_time: string;
    start_price: number | string;
    start_time: string;
    is_active: boolean;
    product: number;
    owner: string;
}

interface AuthContextType {
    authTokens?: { access: string };
    user?: { username: string };
    logoutUser?: () => void;
}

const AllAuctions: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const auth = useContext(AuthContext) as AuthContextType;

    const fetchAuctions = async () => {
        try {
            const response = await axios.get<Auction[]>('http://127.0.0.1:8000/api/products/auctions/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.authTokens?.access,
                }
            });
            setAuctions(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch auctions");
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAuctions();
    }, []);

    const deactivateAuction = async (auctionId: number) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/products/auctions/${auctionId}/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.authTokens?.access,
                }
            });
            fetchAuctions();
        } catch (error) {
            setError("Failed to deactivate auction");
        }
    };

    const formatPrice = (price: number | string): string => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? 'N/A' : numPrice.toFixed(2);
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-blue-900">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    if (error) return (
        <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">All Auctions</h2>
                {auctions.length === 0 ? (
                    <p className="text-center text-white text-xl">No active auctions at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.map((auction) => (
                            <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{auction.product_name}</h3>
                                    <p className="text-lg font-bold text-green-600 mb-2">Current Price: ${formatPrice(auction.current_price)}</p>
                                    <p className="text-sm text-gray-600 mb-4">Ends at {new Date(auction.end_time).toLocaleDateString()}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link to={`/products/auctions/${auction.id}/`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
                                            View Details
                                        </Link>
                                        {auth.user?.username === auction.owner && (
                                            <button 
                                                onClick={() => deactivateAuction(auction.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                                            >
                                                Deactivate Auction
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-8 text-center">
                    <Link to={`/products/create-auction/`} className="inline-block bg-blue-900 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                        Create an Auction
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AllAuctions;