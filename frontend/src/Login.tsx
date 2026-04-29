import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await login(username, password);
    },
    onError: (err: any) => {
      setError(err.message || 'Network error occurred. Please try again.');
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center p-5">
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 w-full max-w-md shadow-2xl text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center mb-5 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500"
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="default"
              size="lg"
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
