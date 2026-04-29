import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [message, setMessage] = useState('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPing = async () => {
      try {
        const response = await fetch('/api/ping', {
          headers: {
            'Authorization': `Basic ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(`API says: ${data.message}`);
        } else {
          setMessage('Failed to load data. Unauthorized.');
          // Auto-logout on 401
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
          }
        }
      } catch (err) {
        setMessage('Network error.');
      }
    };

    fetchPing();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-10">
      <div className="flex justify-between items-center w-full max-w-3xl mb-10">
        <h2 className="text-2xl font-bold text-white">Secure Dashboard</h2>
        <button 
          onClick={handleLogout} 
          className="bg-transparent text-gray-400 border border-white/10 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center w-full max-w-3xl backdrop-blur-md">
        <h3 className="text-base text-gray-400 mb-3">Server Connection Status</h3>
        <div className="text-4xl font-bold text-indigo-500">{message}</div>
      </div>
    </div>
  );
}
