import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const { authFetch } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ping'],
    queryFn: async () => {
      const response = await authFetch('/api/ping');
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Card className="bg-white/5 border-white/10 text-center backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base text-gray-400 font-normal">
              Server Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-500">
              {isLoading ? (
                <span className="text-gray-500 animate-pulse">Loading...</span>
              ) : error ? (
                <span className="text-red-400">Error: {(error as Error).message}</span>
              ) : (
                `API says: ${data?.message}`
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
