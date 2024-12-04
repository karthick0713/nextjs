import React, { ReactNode } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
type Props = {
  children: ReactNode
}

const AuthCard = ({  children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
      <div><Link href="/">
          <Image  src="/landy_logo.png" alt="Logo" width={200} height={200}/>
          </Link>
      </div>
      
      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
        
        {children}
      </div>
    </div>
  )
}

export default AuthCard
