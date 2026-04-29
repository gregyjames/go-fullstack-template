import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = btoa(`${username}:${password}`);
    
    try {
      // Test the credentials against the API
      const response = await fetch('/api/ping', {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.ok) {
        localStorage.setItem('authToken', token);
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center p-5">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Sign in to access your dashboard</p>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center mb-5 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-5 flex flex-col">
            <label htmlFor="username" className="text-sm font-medium mb-2 text-white">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>
          
          <div className="mb-5 flex flex-col">
            <label htmlFor="password" className="text-sm font-medium mb-2 text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white rounded-xl py-3.5 text-base font-semibold cursor-pointer transition-all duration-200 mt-3 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
