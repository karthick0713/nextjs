"use client";
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { AdminQueueResponse, PolicyResponse } from '@/lib/models';
import DashboardLayout from '@/components/DashboardLayout';
import AdminPolicyTable from '@/components/AdminPolicyTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FetchParams {
  data: string;
  start_date: string;
  end_date: string;
  start: number;
  length: number;
  order:{ column: string; dir: string };
  search: { value: string; regex: boolean };
}

export default function AdminDashboardPage() {
  const [policyData, setPolicyData] = useState<AdminQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [params, setParams] = useState<FetchParams>({
    data: "active",
    start_date: "",
    end_date: "",
    start: 0,
    length: 10,
    order: { column: "id", dir: "asc" },
    search: { value: "", regex: false }
  });

  useEffect(() => {
    const fetchPolicyData = async () => {
      setLoading(true);
      try {
        const response = await axios.post<AdminQueueResponse>(
          '/api/admin/queue-data',
          params
        );
        setPolicyData(response.data);
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
      start: 0,
      search: { value, regex: false }
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
        <Tabs defaultValue="unprocessed">
          <TabsList>
            <TabsTrigger value="unprocessed">Unprocessed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          <TabsContent value="unprocessed">
            <Card className="shadow-none border-0 sm:shadow-sm sm:border">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-semibold">Admin Queue</CardTitle>
                <CardDescription>
                  View and manage purchased policies
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <AdminPolicyTable
                  policies={policyData?.data.unprocessed_data || []}
                  onPageChange={handlePageChange}
                  onSearchChange={handleSearchChange}
                  onEntriesChange={handleEntriesChange}
                  totalEntries={policyData?.data.total_unprocessed_data || 0}
                  currentPage={params.start / params.length}
                  pageSize={params.length}
                  isLoading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="failed">

            <Card className="shadow-none border-0 sm:shadow-sm sm:border">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-semibold">Failed Transactions</CardTitle>
                <CardDescription>
                  View and manage failed transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <AdminPolicyTable
                  policies={policyData?.data.failed_data || []}
                  onPageChange={handlePageChange}
                  onSearchChange={handleSearchChange}
                  onEntriesChange={handleEntriesChange}
                  totalEntries={10}
                  currentPage={params.start / params.length}
                  pageSize={params.length}
                  isLoading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}