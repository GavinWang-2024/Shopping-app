import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface Auction {
    id: number;
    product_name: string;
    current_price: number | string;
    end_time: string;
    start_price: number | string;
    start_time: string;
    is_active: boolean;
    product: number;
}

interface AuctionDetailPage extends Auction {
    description: string;
    highest_bidder_username: string;
}

interface AuthContextType {
    authTokens?: { access: string };
    logoutUser?: () => void;
}

const AuctionDetailPage: React.FC = () => {
    const [auction, setAuction] = useState<AuctionDetailPage | null>(null);
    const [bidAmount, setBidAmount] = useState('');
    const { id } = useParams<{ id: string }>();
    const auth = useContext(AuthContext) as AuthContextType;

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const response = await axios.get<AuctionDetailPage>(`http://127.0.0.1:8000/api/products/auctions/${id}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth.authTokens?.access,
                    }
                });
                setAuction(response.data);
            } catch (error) {
                console.error('Error fetching auction:', error);
            }
        };
        fetchAuction();
    }, [id, auth.authTokens]);

    const handleBid = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/products/auctions/${id}/`, {
                bid: bidAmount
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.authTokens?.access,
                },
            });
            setAuction(response.data);
            setBidAmount('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    console.error("Error status:", error.response.status);
                    if (error.response.status === 400) {
                        if (error.response.data.error) {
                            alert(error.response.data.error);
                        } else {
                            alert("Invalid bid. Please check your input and try again.");
                        }
                    } else if (error.response.status === 401) {
                        auth.logoutUser?.();
                        alert("Your session has expired. Please log in again.");
                    } else {
                        alert("An error occurred. Please try again later.");
                    }
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    alert("No response from server. Please check your connection and try again.");
                } else {
                    console.error('Error', error.message);
                    alert("An unexpected error occurred. Please try again.");
                }
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    if (!auction) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-blue-900">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    const minBidAmount = Number(auction.current_price) + 0.01;

    return (
        <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen">
            <div className="container mx-auto px-4 py-8 bg-[#f1f1df] rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{auction.product_name}</h2>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <p className="text-gray-700 mb-4">{auction.description}</p>
                    <p className="text-xl font-semibold text-green-600 mb-2">Current Price: ${auction.current_price}</p>
                    <p className="text-lg text-gray-700 mb-2">Highest Bidder: {auction.highest_bidder_username || 'No bids yet'}</p>
                    <p className="text-sm text-gray-600">
                        From {new Date(auction.start_time).toLocaleDateString()} to {new Date(auction.end_time).toLocaleDateString()}
                    </p>
                </div>
                <form onSubmit={handleBid} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <input 
                            type="number" 
                            value={bidAmount} 
                            onChange={(e) => setBidAmount(e.target.value)} 
                            placeholder="Enter Bid Amount" 
                            min={isNaN(minBidAmount) ? undefined : minBidAmount} 
                            step="0.01" 
                            required
                            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        Place Bid
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuctionDetailPage;