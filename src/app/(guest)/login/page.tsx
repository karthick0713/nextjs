//./src/app/(guest)/login/page.tsx
'use client';

import { z } from "zod";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginFormValues } from '@/lib/models';
import { loginFormSchema } from '@/lib/formschemas';
import AuthCard from "@/components/AuthCard";
import { CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import router from "next/router";

import  axios, { AxiosError } from "axios";
import { useAuth } from "@/hooks/auth";
import { useSearchParams } from 'next/navigation'
import AuthMessageBanner from "@/components/AuthPageBanner";

export default function LoginPage() {
  const { user } = useAuth({ middleware: 'guest' });
  
  const [isSubmitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('')
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const returnUrl = searchParams.get('returnUrl');

  const { login } = useAuth({
    middleware: 'guest',
  })

  useEffect(() => {
    const resetToken = searchParams.get('reset')
    setStatus(resetToken ? atob(resetToken) : '')
  }, [searchParams])

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    defaultValues: {
      email: "",  
      password: "",
      remember: true,
    },
    resolver: zodResolver(loginFormSchema),
    mode:"onChange"
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>)=> {
    setSubmitting(true);
    setServerError(null);
    
    try {
      await login({
        email: data.email,
        password: data.password,
        remember: data.remember || false,
      });
    } catch (error: Error | AxiosError | any) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            loginForm.setError(key as "email" | "password", {
              type: "manual",
              message: errors[key][0],
            });
          });
        }
      } else {
        setServerError("Invalid credentials. Please check your email and password.");
      }
    } finally {
      setSubmitting(false);
      setStatus('');
    }
  };

  return (
    <>
      <Head>
        <title>Login - Account Access</title>
      </Head>
      <AuthMessageBanner message={message ? decodeURIComponent(message) : null} />
      
      <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
        <div className="flex flex-col gap-4 items-center justify-center min-h-[400px] p-4 sm:gap-8 sm:grid sm:grid-cols-2 lg:gap-12">
          <div className="hidden lg:block">
          <Image
              alt="Cover"
              className="hidden aspect-[4/3] rounded-xl object-cover md:block"
              height={500}
              src="/login.jpg"
              width={600}
              priority // Add this for above-the-fold images
            />
          </div>
          
          <AuthCard>
            <CardTitle className="text-2xl font-bold mb-6">Sign in to your account</CardTitle>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
                {serverError && (
                  <Alert variant="destructive">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="text-right">
                            <Link 
                              href="/forgot-email" 
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot email?
                            </Link>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="text-right">
                            <Link 
                              href="/forgot-password" 
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot password?
                            </Link>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={loginForm.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Remember me
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link 
                      href="/register" 
                      className="text-primary hover:underline"
                    >
                      Create one
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </AuthCard>
        </div>
      </div>
    </>
  );
}

