import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

interface Creation {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
  is_auction: boolean;
  auction_details: {
    start_price: number;
    current_price: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    highest_bidder_username: string | null;
  } | null;
}

const OwnerPage: React.FC = () => {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchCreations = async () => {
      if (!authContext || !authContext.authTokens) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/creations/', {
          headers: {
            'Authorization': `Bearer ${authContext.authTokens.access}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch creations');
        }

        const data = await response.json();
        setCreations(data);
      } catch (err) {
        setError('Error fetching creations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreations();
  }, [authContext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-blue-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-red-500 text-xl">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Your Creations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation) => (
            <div key={creation.id} className="bg-[#f1f1df] rounded-lg shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  {creation.name}
                  {creation.is_auction && (
                    <span className="ml-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                      Auction
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 mb-4">{creation.description}</p>
                <p className="text-lg font-bold text-green-600 mb-2">Price: ${creation.price}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Created at: {new Date(creation.created_at).toLocaleString()}
                </p>
                {creation.is_auction && creation.auction_details && (
                  <div className="bg-white p-4 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Auction Details</h3>
                    <p className="text-gray-600">Start Price: ${creation.auction_details.start_price}</p>
                    <p className="text-gray-600">Current Price: ${creation.auction_details.current_price}</p>
                    <p className="text-gray-600">
                      Start Time: {new Date(creation.auction_details.start_time).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      End Time: {new Date(creation.auction_details.end_time).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Status: 
                      <span className={`ml-2 ${creation.auction_details.is_active ? 'text-green-500' : 'text-red-500'}`}>
                        {creation.auction_details.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    {creation.auction_details.highest_bidder_username && (
                      <p className="text-gray-600">
                        Highest Bidder: {creation.auction_details.highest_bidder_username}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerPage;