import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bars3Icon, BellIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from './AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
]

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <nav className="relative bg-slate-900/50 border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Mobile menu (Sheet) */}
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Bars3Icon className="size-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-slate-900 border-white/10 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-2">
                  {navigation.map((item) => {
                    const isCurrent = location.pathname === item.href;
                    return (
                      <Button
                        key={item.name}
                        variant={isCurrent ? "secondary" : "ghost"}
                        className={cn(
                          "justify-start text-base w-full",
                          isCurrent ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => {
                          navigate(item.href);
                        }}
                      >
                        {item.name}
                      </Button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isCurrent = location.pathname === item.href;
                  return (
                    <Button
                      key={item.name}
                      variant={isCurrent ? "secondary" : "ghost"}
                      className={cn(
                        "text-sm font-medium",
                        isCurrent ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => navigate(item.href)}
                    >
                      {item.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <BellIcon className="size-6" />
              <span className="sr-only">View notifications</span>
            </Button>

            {/* Profile dropdown (shadcn DropdownMenu) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none">
                  <UserIcon className="size-6" />
                  <span className="sr-only">Open user menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-white/10 text-white" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-gray-400">admin@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                  Your profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="text-red-400 hover:bg-red-500/10 focus:text-red-400 cursor-pointer"
                  onClick={logout}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
