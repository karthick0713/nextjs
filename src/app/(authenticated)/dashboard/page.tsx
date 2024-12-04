// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { PolicyResponse } from '@/lib/models';
import DashboardLayout from '@/components/DashboardLayout';
import PolicyAccordion from '@/components/PolicyAccordion';
import RenewalCard from '@/components/RenewalCard';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import router from 'next/router';
import SecondYearPaymentCard from '@/components/SecondYearPaymentCard';

export default function DashboardPage() {
  const [policyData, setPolicyData] = useState<PolicyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await axios.get<PolicyResponse>('/api/user/policyData');
        setPolicyData(response.data);
      } catch (err) {
        setError('Failed to fetch policy data. Please try again later.');
        console.error('Error fetching policy data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, []);

  const handleRenewClick = () => {
    // Navigate to quote page with the policy number
    if (policyData?.data.renewal) {
      router.push(`/quote?policy=${policyData.data.renewal.policynumnew}`);
    }
  };
  const handlePaymentClick = () => {
    if (policyData?.data.policies[0]) {
      router.push(`/payment?policy=${policyData.data.policies[0].policynumnew}`);
    }
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
        {/* Show Renewal Card if renewal data exists */}
        {policyData?.data.renewal && Array.isArray(policyData.data.renewal) &&  policyData.data.renewal.length > 0 && (
          <RenewalCard 
            renewal={policyData.data.renewal}
            onRenewClick={handleRenewClick}
          />
        )}
        {policyData?.data.second_year_payment === 1 && policyData.data.policies[0] && (
          <SecondYearPaymentCard 
            policy={policyData.data.policies[0]}
            onPayClick={handlePaymentClick}
          />
        )}
        <Card className="shadow-none border-0 sm:shadow-sm sm:border">
          <CardHeader className="pb-4 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold">My Policies</CardTitle>
            <CardDescription>
              View and manage your insurance policies
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {policyData?.data.policies && policyData.data.policies.length > 0 ? (
              <PolicyAccordion policies={policyData.data.policies} />
            ) : (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">No policies found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}