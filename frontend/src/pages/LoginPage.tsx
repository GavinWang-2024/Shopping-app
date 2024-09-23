import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext must be used within AuthProvider");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-500 text-white flex flex-col">
      

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <h2 className="text-5xl font-extrabold text-center mb-6">Welcome Back!</h2>
          <p className="text-xl text-center mb-8">Please log in to continue</p>

          <form className="bg-blue-500 p-8 rounded-lg shadow-2xl" onSubmit={auth.loginUser}>
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                className="w-full p-3 rounded text-black border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="w-full p-3 rounded text-black border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="submit"
                value="Sign In"
                className="w-full p-3 bg-yellow-100 text-black rounded hover:bg-yellow-200 transition-colors cursor-pointer font-semibold"
              />
            </div>
            <p className="mt-4 text-center">
              New here? <Link to="/register/" className="text-blue-400 hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;