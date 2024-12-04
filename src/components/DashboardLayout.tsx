"use client"
// components/DashboardLayout.tsx
import React from 'react';
import { useAuth } from '@/hooks/auth';


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth({ middleware: 'auth' });

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 sm:ml-64">
        <div className="sm:p-8 max-w-7xl mx-auto ">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;