import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

interface AddToCartButtonProps {
  productId: number;
  className?: string; // Add a className prop
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, className }) => {
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const addToCart = async () => {
    setError(null);
    console.log(`Adding ${productId} to cart`);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(auth?.authTokens?.access),
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (response.ok) {
        console.log("Added to cart");
        alert("Product added to cart");
      } else {
        const errorData = await response.json();
        console.error("Failed to add to cart", errorData);
        setError(errorData.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding to cart", err);
      setError("An error occurred while adding to cart");
    }
  };

  return (
    <div>
      <button 
        onClick={addToCart} 
        className={`bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-2 ${className}`} // Apply className
      >
        Add to Cart
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddToCartButton;
