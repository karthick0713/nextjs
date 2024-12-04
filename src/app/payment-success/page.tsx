'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { useData } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth';
import { InsuranceFileUpload } from '@/components/InsuranceFileUpload';

export default function PaymentSuccessPage() {
  const { paymentSuccessData } = useData();
  const router = useRouter();
  const { login } = useAuth({ middleware: 'guest' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: true,
    role: 'user'
  });

  useEffect(() => {
    if (!paymentSuccessData) {
      router.push('/');
    } else {
      setFormData(prev => ({
        ...prev,
        email: paymentSuccessData.email
      }));
    }
  }, [paymentSuccessData, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!paymentSuccessData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading payment information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-center items-center py-6">
        <Image src="/landy_logo.png" alt="Landy Header" width={200} height={200} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription className="text-base mt-2">
              Policy documents will be emailed to you within the hour confirming coverage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">Policy Number</p>
                <p className="font-medium">{paymentSuccessData.policy_no}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">Quote ID</p>
                <p className="font-medium">{paymentSuccessData.quote_id}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{paymentSuccessData.email}</p>
              </div>
            </div>
            
            {paymentSuccessData?.upload_insurance_file && (
              <InsuranceFileUpload
                quote_id={paymentSuccessData.quote_id}
                policy_num={paymentSuccessData.policy_no}
                last_id={paymentSuccessData.last_id || ''}
              />
            )}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                To access all policy documents, please log in to the Landy Policy Manager Portal.
              </p>
              <p className="text-sm text-black text-center">
                Password has been sent to your email address.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    disabled
                    className="bg-gray-50"
                  />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Password"
                  />
                </div>
                
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}