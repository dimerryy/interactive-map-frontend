import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = "https://interactive-map-backend.onrender.com";
const Welcome = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/map');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_BASE}/register`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/map');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome Page</h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
