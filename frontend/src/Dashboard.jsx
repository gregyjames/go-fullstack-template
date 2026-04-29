import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-md">
          <h3 className="text-base text-gray-400 mb-3">Server Connection Status</h3>
          <div className="text-4xl font-bold text-indigo-500">{message}</div>
        </div>
      </main>
    </div>
  );
}
