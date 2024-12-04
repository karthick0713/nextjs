'use client';

import { z } from "zod";
// RegistrationPage.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Head from 'next/head';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registrationFormSchema } from '@/lib/formschemas';
import AuthCard from "@/components/AuthCard";
import { useSearchParams, useRouter } from "next/navigation";
import router from "next/router";
import { useAuth } from "@/hooks/auth";
import AuthMessageBanner from "@/components/AuthPageBanner";
import { sendVerificationCode } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegistrationPage() {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'direct' | 'producer'>('direct');
  const [isSubmitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{ sent: boolean; message: string | null }>({
    sent: false,
    message: null
  });
  
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const returnUrl = searchParams.get('returnUrl');
  const roleParam = searchParams.get('role')?.toLowerCase();

  // Handle initial tab selection based on URL parameter
  useEffect(() => {
    if (roleParam === 'producer' || roleParam === 'user') {
      const newRole = roleParam === 'user' ? 'direct' : 'producer';
      setActiveTab(newRole);
      localStorage.setItem('preferredRegistrationRole', newRole);
    } else {
      const storedRole = localStorage.getItem('preferredRegistrationRole') as 'direct' | 'producer';
      if (storedRole) {
        setActiveTab(storedRole);
      }
    }
  }, [roleParam]);
  // Handle tab changes
  const handleTabChange = (value: string) => {
    const newRole = value as 'direct' | 'producer';
    setActiveTab(newRole);
    localStorage.setItem('preferredRegistrationRole', newRole);
  };

  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: returnUrl ? returnUrl : '/dashboard',
  })

  const form = useForm<z.infer <typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      policy_num: "",
      zipcode: "",
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      name:"",
    },
  });

  const onSubmit = async (data: z.infer <typeof registrationFormSchema>) => {
    setSubmitting(true);
    setServerError(null);
    try {
      // Handle registration submission
      console.log(data);
      await register(data);
    } catch (error: any) {
      console.error(error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          "An error occurred during registration. Please try again.";
      setServerError(errorMessage);
      
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendVerificationCode = async () => {
    setIsSendingCode(true);
    setVerificationStatus({ sent: false, message: null });
    const email = form.getValues("email");
    if (!email || !form.trigger("email")) {
      return;
    }

    try {
          const response = await sendVerificationCode(email);
          if (response.status === 'success') {
            setVerificationStatus({ 
              sent: true, 
              message: 'Verification code sent to your email' 
            });
          }
        } catch (error) {
          setVerificationStatus({ 
            sent: false, 
            message: 'Failed to send verification code. Please try again.' 
          });
        } finally{
          setIsSendingCode(false);
        }
    
    console.log(`Sending verification code to ${email}`);
  };

  return (
    <>
      <Head>
        <title>Register - Create your account</title>
      </Head>
      <AuthMessageBanner message={message ? decodeURIComponent(message) : null} />
      
      <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
        <div className="flex flex-col gap-4 items-center justify-center min-h-[400px] p-4 sm:gap-8 sm:grid sm:grid-cols-2 lg:gap-12 ">
          <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start lg:pt-32">
          <img
              alt="Cover"
              className="hidden aspect-[4/3] rounded-xl object-cover md:block"
              height="500"
              src="/login.jpg"
              width="600"
            />
          </div>
          <AuthCard>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full">
              <div className="sticky top-0 bg-white z-10">
                <CardTitle className="text-2xl font-bold mb-4">Create your account</CardTitle>
                <TabsList className="mb-4">
                  <TabsTrigger value="direct">Direct Registration</TabsTrigger>
                  <TabsTrigger value="producer">Producer Registration</TabsTrigger>
                </TabsList>
              </div>
              <div className="overflow-y-auto flex-1 px-2">
                <TabsContent value="direct" className="mt-0">
                  
                
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit,(errors)=>{
                      console.log(errors);
                    })} className="space-y-6">
                      

                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={form.control}
                          name="policy_num"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Policy Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your policy number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="zipcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter ZIP code" 
                                  maxLength={5}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input 
                                      type="email" 
                                      placeholder="Enter your email" 
                                      {...field} 
                                      className="flex-1"
                                    />
                                    <Button 
                                      type="button"
                                      onClick={handleSendVerificationCode}
                                      disabled={!form.getValues("email") || isSendingCode}
                                    >
                                    Send Code
                                    </Button>
                                  </div>
                                </FormControl>
                                {verificationStatus.message && (
                                <FormDescription className={verificationStatus.sent ? 'text-green-600' : 'text-red-600'}>
                                  {verificationStatus.message}
                                </FormDescription>
                                )}                            
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter 6-digit verification code" 
                                    maxLength={6}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter the verification code sent to your email
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Create a password" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Must be at least 8 characters with mixed case, numbers & symbols
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Confirm your password" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {serverError && (
                        <Alert variant="destructive">
                          <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                        )}
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>

                        <div className="text-center text-sm">
                          Already have an account?{" "}
                          <Link 
                            href="/login" 
                            className="text-primary hover:underline"
                          >
                            Sign in
                          </Link>
                        </div>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="producer" className="mt-0">
                    {/* Producer registration form will go here */}
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit,(errors)=>{
                      console.log(errors);
                    })} className="space-y-6">
                      

                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={form.control}
                          name="policy_num"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Producer Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your producer/agent code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="zipcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter ZIP code" 
                                  maxLength={5}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input 
                                      type="email" 
                                      placeholder="Enter your email" 
                                      {...field} 
                                      className="flex-1"
                                    />
                                    <Button 
                                      type="button"
                                      onClick={handleSendVerificationCode}
                                      disabled={!form.getValues("email") || isSendingCode}
                                    >
                                    Send Code
                                    </Button>
                                  </div>
                                </FormControl>
                                {verificationStatus.message && (
                                <FormDescription className={verificationStatus.sent ? 'text-green-600' : 'text-red-600'}>
                                  {verificationStatus.message}
                                </FormDescription>
                                )}                            
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter 6-digit verification code" 
                                    maxLength={6}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter the verification code sent to your email
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Create a password" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Must be at least 8 characters with mixed case, numbers & symbols
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Confirm your password" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {serverError && (
                        <Alert variant="destructive">
                          <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                        )}
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>

                        <div className="text-center text-sm">
                          Already have an account?{" "}
                          <Link 
                            href="/login" 
                            className="text-primary hover:underline"
                          >
                            Sign in
                          </Link>
                        </div>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </div>
            </Tabs>
          </AuthCard>
        </div>
      </div>
    </>
  );
}