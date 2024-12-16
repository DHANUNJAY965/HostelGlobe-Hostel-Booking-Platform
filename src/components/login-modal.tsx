"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type LoginType = 'user' | 'admin' | 'superadmin';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
  loginType: LoginType;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSignupClick, loginType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: loginType }),
      });

      if (response.ok) {
        const session = await response.json(); 
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        // Save session to local storage
        localStorage.setItem('session', JSON.stringify(session));

        onClose();

        // Redirect based on role
        if (loginType === 'admin') {
          router.push('/admin-dashboard');
        } else if (loginType === 'superadmin') {
          router.push('/superadmin-dashboard');
        } else {
          router.push('/explore');
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Login failed",
          description: errorData.error || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{loginType.charAt(0).toUpperCase() + loginType.slice(1)} Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <p className="text-center mt-4">
          New user?{' '}
          <Button variant="link" onClick={onSignupClick}>
            Sign up
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
};
