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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Secure Dashboard</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      
      <div className="stat-card">
        <h3>Server Connection Status</h3>
        <div className="value">{message}</div>
      </div>
    </div>
  );
}
