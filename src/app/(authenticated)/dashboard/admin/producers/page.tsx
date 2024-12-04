"use client";
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { AdminProducerData, AdminProducerResponse, AdminQueueResponse, PolicyResponse } from '@/lib/models';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminUserTable from '@/components/AdminUserTable';
import { AdminCreateUserDialog } from '@/components/AdminCreateUserDialog';

interface FetchParams {
  role: number;
  start: number;
  length: number;
  order:{ column: string; dir: string };
  search: { value: string; column: string }[];
}

export default function AdminProdcuersManagementPage() {
  const [userData, setUserData] = useState<AdminProducerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<FetchParams>({
    role: 3, //Producers
    start: 0,
    length: 10,
    order: { column: "id", dir: "asc" },
    search: [{ value: "", column: "" }]

  });

  useEffect(() => {
    const fetchPolicyData = async () => {
      setLoading(true);
      try {
        const response = await axios.post<AdminProducerResponse>(
          '/api/admin/users-data',
          params
        );
        setUserData(response.data.data);
      } catch (err) {
        setError('Failed to fetch policy data. Please try again later.');
        console.error('Error fetching policy data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, [params]);

  const handlePageChange = (pageIndex: number) => {
    setParams(prev => ({
      ...prev,
      start: pageIndex * prev.length
    }));
  };

  const handleSearchChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      search: [{ value, column:"" }]
    }));
  };

  const handleEntriesChange = (length: number) => {
    setParams(prev => ({
      ...prev,
      length,
      start: 0
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500 text-center py-6">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        <Card className="shadow-none border-0 sm:shadow-sm sm:border">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg sm:text-xl font-semibold">Manage Producers</CardTitle>
              <CardDescription>
                View and manage producers
              </CardDescription>
            </div>
            <AdminCreateUserDialog 
              role={3}
              onUserCreated={() => {
                // Refresh the table data
                setParams(prev => ({ ...prev }));
              }}
            />
          </div>
        </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <AdminUserTable
              userDetails={userData?.usersDetails || []}
              onPageChange={handlePageChange}
              onSearchChange={handleSearchChange}
              onEntriesChange={handleEntriesChange}
              totalEntries={userData?.TotalDisplayRecords || 0}
              currentPage={params.start / params.length}
              pageSize={params.length}
              isLoading={loading} 
            />
          </CardContent>
        </Card>
          
      </div>
    </DashboardLayout>
  );
}