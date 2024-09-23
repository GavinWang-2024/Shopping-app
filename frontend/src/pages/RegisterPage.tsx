import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const RegisterPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate=useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = { username, email, password };
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', data);
            setSuccessMessage('Registration successful! You can now log in.');
            setError(null);
            // Clear the input fields
            setUsername('');
            setEmail('');
            setPassword('');
            navigate('/login/');

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(`Registration Failed: ${error.response?.data || error.message}`);
            } else {
                setError('An unexpected error occurred');
            }
            setSuccessMessage(null);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-400 to-blue-900 min-h-screen flex items-center justify-center">
            <div className="bg-[#f1f1df] p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-black">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        Register
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}
            </div>
        </div>
    );
};

export default RegisterPage