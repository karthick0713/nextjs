// components/Navigation.tsx
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Home, FileText, Settings, LogOut, Menu } from 'lucide-react'
import { UserType } from '@/lib/models'
import { useAuth } from '@/hooks/auth'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
  
  { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
]

const Navigation = ({ user }: { user: UserType }) => {
  const pathname = usePathname()
  const { logout } = useAuth({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Top Navigation - Mobile Only */}
      <div className="bg-white border-b border-gray-200 sm:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard">
            <img
              alt="Cover"
              height="200"
              src="/landy_logo.png"
              width="200"
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Left Sidebar - Desktop */}
      <div className={cn(
        "bg-white w-64 border-r border-gray-200 flex-shrink-0",
        "hidden sm:block fixed h-full"
      )}>
        {/* Desktop Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center px-6">
          <Link href="/dashboard">
            <img
              alt="Cover"
              height="200"
              src="/landy_logo.png"
              width="200"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md text-sm font-medium",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}>
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile and Logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="h-16 border-b border-gray-200 flex items-center px-6">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <img
                  alt="Cover"
                  height="200"
                  src="/landy_logo.png"
                  width="200"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
              <nav className="flex-1 px-4 py-4">
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center px-4 py-2 rounded-md text-sm font-medium",
                          pathname === item.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}>
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation