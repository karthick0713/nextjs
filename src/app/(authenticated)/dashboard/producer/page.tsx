"use client";

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { PolicyResponse, ProducerDashBoardPolicyResponse } from '@/lib/models';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminPolicyTable from '@/components/AdminPolicyTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import { addMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { mockPolicyDetailsResponse } from '@/lib/mockdata';
import { useAuth } from '@/hooks/auth';
import ProducerPolicyTable from '@/components/ProducerPolicyTable';

const PROGRAM_OPTIONS = {
  RAS: "Real Estate Express Agent & Broker Express Application",
  RAP: "Individual Real Estate Appraiser Application",
  ACS: "Accountants Express Application"
};

interface FetchParams {
  agent_code: string;
  lob?: string;
  start_date?: string;
  end_date?: string;
  start: number;
  length: number;
  order: {
    column: string;
    dir: string;
  }[];
  search: [{
    value: string;
    column: string;
  }];
  draw: number;
}

export default function AgentPolicyDashboardPage() {
  const [policyData, setPolicyData] = useState<ProducerDashBoardPolicyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize with next month's date range
  const nextMonth = addMonths(new Date(), 1);
  const defaultDateRange = {
    from: startOfMonth(nextMonth),
    to: endOfMonth(nextMonth)
  };

  const agent_code = useAuth({}).user?.agent_code;
  //console.log("agent_code", agent_code);

  const [params, setParams] = useState<FetchParams>({
    agent_code: agent_code ?? '', // This should come from user context/session
    start: 0,
    length: 10,
    order: [
      { column: 'policynum2', dir: 'asc' },
      { column: 'expdate', dir: 'desc' }
    ],
    search: [{ value: '',column:'' }],
    draw: 1,
    start_date: format(defaultDateRange.from, 'yyyy-MM-dd'),
    end_date: format(defaultDateRange.to, 'yyyy-MM-dd')
  });
  useEffect(() => {
    if (agent_code) {
      setParams(prev => ({
        ...prev,
        agent_code: agent_code
      }));
    }
  }, [agent_code]);
  
  useEffect(() => {
    const fetchPolicyData = async () => {
      setLoading(true);
      try {
        const response = await axios.post<ProducerDashBoardPolicyResponse>(
          '/api/producer/policies',
          params
        );
        console.log("Params", params);
        setPolicyData(response.data);
      } catch (err) {
        setError('Failed to fetch policy data. Please try again later.');
        console.error('Error fetching policy data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.agent_code) {
     fetchPolicyData();
    }
  }, [params]);

  const handleProgramChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      lob: value,
      start: 0,  // Reset pagination when filter changes
      draw: prev.draw + 1
    }));
  };

  const handleDateRangeChange = (dateRange: { from: Date; to: Date }) => {
    if (dateRange.from && dateRange.to) {
      setParams(prev => ({
        ...prev,
        start_date: format(dateRange.from, 'yyyy-MM-dd'),
        end_date: format(dateRange.to, 'yyyy-MM-dd'),
        start: 0,  // Reset pagination when filter changes
        draw: prev.draw + 1
      }));
    }
  };

  const handleResetFilters = () => {
    setParams(prev => ({
      ...prev,
      lob: undefined,
      start_date: format(defaultDateRange.from, 'yyyy-MM-dd'),
      end_date: format(defaultDateRange.to, 'yyyy-MM-dd'),
      start: 0,
      draw: prev.draw + 1
    }));
  };

  const handlePageChange = (pageIndex: number) => {
    setParams(prev => ({
      ...prev,
      start: pageIndex * prev.length,
      draw: prev.draw + 1
    }));
  };

  const handleSearchChange = (value: string) => {
    setParams(prev => ({
      ...prev,
      start: 0,
      search: [{ "value": value, "column": "" }],
      draw: prev.draw + 1
    }));
  };

  const handleEntriesChange = (length: number) => {
    setParams(prev => ({
      ...prev,
      length,
      start: 0,
      draw: prev.draw + 1
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
  const policies = policyData?.data?.policies ?? [];
  const totalEntries = policyData?.data?.TotalDisplayRecords ?? 0;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="shadow-none border-0 sm:shadow-sm sm:border">
          <CardHeader className="pb-4 px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Agent Policies</CardTitle>
                <CardDescription>
                  View and manage agent policies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Program:</span>
                <Select onValueChange={handleProgramChange}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROGRAM_OPTIONS).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Expiry Date Range:</span>
                <DateRangePicker
                  initialDateRange={defaultDateRange}
                  onChange={handleDateRangeChange}
                />
              </div>

              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="ml-auto"
              >
                Upcoming Renewals
              </Button>
            </div>

            <ProducerPolicyTable
              policies={policies} 
              onPageChange={handlePageChange}
              onSearchChange={handleSearchChange}
              onEntriesChange={handleEntriesChange}
              totalEntries={totalEntries}
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