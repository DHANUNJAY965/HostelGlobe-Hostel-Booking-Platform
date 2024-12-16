"use client"

import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast';

type SignupType = 'user' | 'admin' | 'superadmin'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginClick: () => void
  signupType: SignupType
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onLoginClick, signupType }) => {
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // const router = useRouter()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, email, phoneNumber, password, role: signupType }),
      })
      if (response.ok) {
        toast({
          title: "Signup successful",
          description: "Your account has been created. Please log in.",
        })
        onClose()
        onLoginClick()
      } else {
        const data = await response.json()
        toast({
          title: "Signup failed",
          description: data.message || "An error occurred during signup.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: "Signup error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{signupType.charAt(0).toUpperCase() + signupType.slice(1)} Signup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <p className="text-center mt-4">
          Already registered?{' '}
          <Button variant="link" onClick={onLoginClick}>
            Log in
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  )
}

