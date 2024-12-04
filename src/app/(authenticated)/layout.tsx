'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/components/Layouts/Navigation'

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth({ middleware: 'auth' })

  return (
    <>
      <Navigation user={user} />

      {/* Page Content */}
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
          {children}
      </main>
       
    </>
  )
}

export default AppLayout
