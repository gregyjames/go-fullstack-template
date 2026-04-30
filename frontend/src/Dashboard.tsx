import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlusIcon } from '@heroicons/react/24/outline';

interface User {
  ID: number;
  username: string;
  email: string;
}

export default function Dashboard() {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  // Query for server status
  const pingQuery = useQuery({
    queryKey: ['ping'],
    queryFn: async () => {
      const response = await authFetch('/api/ping');
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    },
  });

  // Query for users list
  const usersQuery = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await authFetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });

  // Mutation to create a test user
  const createUserMutation = useMutation({
    mutationFn: async () => {
      const randomId = Math.floor(Math.random() * 1000);
      const response = await authFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `user_${randomId}`,
          email: `user_${randomId}@example.com`,
        }),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Status Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-gray-400 font-normal">
              Server Connection Status
            </CardTitle>
            <div className={cn(
              "h-2 w-2 rounded-full",
              pingQuery.isLoading ? "bg-gray-500 animate-pulse" : pingQuery.error ? "bg-red-500" : "bg-green-500 shadow-lg shadow-green-500/50"
            )} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">
              {pingQuery.isLoading ? (
                <span className="text-gray-500 animate-pulse">Checking...</span>
              ) : pingQuery.error ? (
                <span className="text-red-400">Error: {(pingQuery.error as Error).message}</span>
              ) : (
                `API says: ${pingQuery.data?.message}`
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Database Type: {pingQuery.data?.db_type || "Unknown"}
            </p>
          </CardContent>
        </Card>

        {/* Users Management Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white">
              GORM User Management
            </CardTitle>
            <Button 
              onClick={() => createUserMutation.mutate()} 
              disabled={createUserMutation.isPending}
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <UserPlusIcon className="size-4 mr-2" />
              {createUserMutation.isPending ? "Adding..." : "Add Test User"}
            </Button>
          </CardHeader>
          <CardContent>
            {usersQuery.isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
              </div>
            ) : usersQuery.error ? (
              <div className="text-red-400 py-4">
                Failed to load users: {(usersQuery.error as Error).message}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase text-gray-500 border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Username</th>
                      <th className="px-4 py-3">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersQuery.data?.map((user) => (
                      <tr key={user.ID} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">{user.ID}</td>
                        <td className="px-4 py-4 font-medium text-white">{user.username}</td>
                        <td className="px-4 py-4 text-gray-400">{user.email}</td>
                      </tr>
                    ))}
                    {usersQuery.data?.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-gray-500 italic">
                          No users found in database. Click "Add Test User" to begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { cn } from '@/lib/utils';
