"use client";

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LoginModal } from './login-modal'
import { SignupModal } from './signup-modal'

export const Navbar = ({ user }: { user?: { username: string }, role?: string }) => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [loginType, setLoginType] = useState<'user' | 'admin' | 'superadmin'>('user')

  // Handle logout
  const handleLogout = () => {
    // Clear session data from local storage
    localStorage.removeItem('session');
    
    // Redirect to homepage
    router.push('/');
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-background">
      <Link href="/" className="text-2xl font-bold">
        HostelGlobe
      </Link>
      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <Button onClick={() => {
              setLoginType('user')
              setLoginModalOpen(true)
            }}>User Login</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Admin Login</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => {
                  setLoginType('admin')
                  setLoginModalOpen(true)
                }}>
                  Admin Login
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {
                  setLoginType('superadmin')
                  setLoginModalOpen(true)
                }}>
                  Super Admin Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {user && (
          <>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className=' hover:cursor-pointer'>
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSignupClick={() => {
          setLoginModalOpen(false)
          setSignupModalOpen(true)
        }}
        loginType={loginType}
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onLoginClick={() => {
          setSignupModalOpen(false)
          setLoginModalOpen(true)
        }}
        signupType={loginType}
      />
    </nav>
  )
}

