'use client';

import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useSearchParams } from 'next/navigation'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

import AuthCard from '@/components/AuthCard'
import { useEffect, useState } from 'react'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from '@/components/ui/checkbox'
import axios, {AxiosError } from 'axios'
import { loginFormSchema, producerFormSchema } from '@/lib/formschemas';
import Image from 'next/image';



// Add type for valid roles
type LoginRole = 'direct' | 'producer';

export default function Home() {
  const { user } = useAuth({ middleware: 'guest' })
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<string>('')
  const [isSubmitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<LoginRole>('direct')

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })

  const {producerLogin} = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })
  // Handle initial role setting and persistence
  useEffect(() => {
    const roleParam = searchParams.get('role')?.toLowerCase()
    const storedRole = localStorage.getItem('preferredLoginRole') as LoginRole | null
    
    // Validate and set role from URL parameter
    if (roleParam === 'producer' || roleParam === 'direct') {
      const newRole: LoginRole = roleParam === 'direct' ? 'direct' : 'producer'
      setActiveTab(newRole)
      localStorage.setItem('preferredLoginRole', newRole)
    }
    // Fall back to stored preference if no URL parameter
    else if (storedRole === 'direct' || storedRole === 'producer') {
      setActiveTab(storedRole)
    }
  }, [searchParams])

  // Handle tab changes and persist preference
  const handleTabChange = (value: string) => {
    const newRole = value as LoginRole
    setActiveTab(newRole)
    localStorage.setItem('preferredLoginRole', newRole)
  }

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
  
  const producerForm = useForm<z.infer<typeof producerFormSchema>>({
    defaultValues: {
      agent_code: "",  
      password: "",
      remember: true,
    },
    resolver: zodResolver(producerFormSchema),
    mode:"onChange"
  });


  const onSubmit = async (data: z.infer<typeof loginFormSchema>)=> {
    setSubmitting(true);
    console.log(data);
    try {
      await login(data);
    } catch (error: Error | AxiosError | any) {
      console.log(error);
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
        // Handle other types of errors
        loginForm.setError("root", {
          type: "manual",
          message: "Either the username or password is incorrect",
        });
      }
    } finally {
      setSubmitting(false);
      setStatus('');
    }
  }

  

  const onProducerSubmit = async (data: z.infer<typeof producerFormSchema>)=> {
    setSubmitting(true);
    console.log(data);
    try {
      await producerLogin(data);
    } catch (error: Error | AxiosError | any) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            producerForm.setError(key as "agent_code" | "password", {
              type: "manual",
              message: errors[key][0],
            });
          });
        }
      } else {
        // Handle other types of errors
        producerForm.setError("root", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
      setStatus('');
    }
  }

  return (
    <>
      <Head>
        <title>Landy Insurance</title>
      </Head>

      <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">

        <div className=" flex flex-col gap-4 items-center justify-center min-h-[400px] p-4 sm:gap-8 sm:grid sm:grid-cols-2 lg:gap-12">
          <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start lg:pt-32">
            <Image
              alt="Cover"
              className="hidden aspect-[4/3] rounded-xl object-cover md:block"
              height="500"
              src="/login.jpg"
              width="600"
            />
          </div>


          <div className="flex flex-col gap-4 sm:gap-6">
            <AuthCard>
                <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full ">
                  <TabsList className="sticky top-0 bg-zinc-100 z-10 mb-4">
                    <TabsTrigger value="direct">Direct Login</TabsTrigger>
                    <TabsTrigger value="producer">Producer Login</TabsTrigger>
                  </TabsList>
                  <div className="flex-grow overflow-y-auto">
                    <TabsContent value="direct" className="h-full mx-2">
                        <AuthSessionStatus className="mb-4" status={status} />
                        <p className="text-base font-semibold pb-5 pt-1">
                              If you are not currently registered but would like to get a quote or renew your Errors and Omissions/ Professional Liability Insurance policy, Click below button.
                        </p>
                        <div className="pb-4 ">
                        <Button className="w-full">
                          <Link href="/quote">New Quote / Renew</Link>
                        </Button>
                        </div>
                        <p className="text-base font-semibold pb-4 pt-1">
                          If you are a Landy Insured and have already registered enter your e-mail and password below to login.
                        </p>
                        
                          <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onSubmit)}>
                              <div className="grid gap-2">
                                <FormField
                                  defaultValue=''
                                  
                                  control={loginForm.control}
                                  name="email" 
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" placeholder="Enter your email id" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                

                                <FormField
                                  control={loginForm.control}
                                  name="password"
                                  
                                  render={({ field }) => (
                                    <FormItem className="">
                                      <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                          <Link
                                            href="/forgot-password"
                                            className="text-sm underline"
                                          >
                                          Forgot your password?
                                        </Link>
                                      </div>
                                      <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={loginForm.control}
                                  name="remember"
                                  render={({ field }) => (
                                    <FormItem className="">
                                      <FormControl>
                                        <Checkbox  />
                                      </FormControl>
                                      <FormLabel className="ml-2 text-[#252729] text-sm leading-[150%] tracking-[-0.4px] font-medium">Remember me</FormLabel>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                                </Button>
                                {loginForm.formState.errors.root && (
                                  <p className="text-red-500 text-sm mt-2">{loginForm.formState.errors.root.message}</p>
                                )}
                              </div>
                              <div className="mt-4 text-center text-sm">
                                Have a policy with us but don&apos;t have an account? {" "}
                                <Link href="/register" className="underline">
                                  Sign up
                                </Link>
                              </div>
                            </form>
                          </Form>
                        
                    </TabsContent>
                      <TabsContent value="producer" className="h-full mx-2">
                        <Form {...producerForm}>
                            <form onSubmit={producerForm.handleSubmit(onProducerSubmit)}>
                            <div className="grid gap-2">
                              <FormField
                                defaultValue=''
                                
                                control={producerForm.control}
                                name="agent_code" 
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Producer/Agent Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter your Agent/Producer code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              

                              <FormField
                                control={producerForm.control}
                                name="password"
                                
                                render={({ field }) => (
                                  <FormItem className="">
                                    <div className="flex items-center justify-between">
                                      <FormLabel>Password</FormLabel>
                                        <Link
                                          href="/forgot-password"
                                          className="text-sm underline"
                                          >
                                        Forgot your password?
                                      </Link>
                                    </div>
                                    <FormControl>
                                      <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={producerForm.control}
                                name="remember"
                                render={({ field }) => (
                                  <FormItem className="">
                                    <FormControl>
                                      <Checkbox  />
                                    </FormControl>
                                    <FormLabel className="ml-2 text-[#252729] text-sm leading-[150%] tracking-[-0.4px] font-medium">Remember me</FormLabel>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <Button type="submit" className="w-full">
                                Login
                              </Button>
                              {producerForm.formState.errors.root && (
                                <p className="text-red-500 text-sm mt-2">{producerForm.formState.errors.root.message}</p>
                              )}
                            </div>
                            <div className="mt-4 text-center text-sm">
                              Have a policy with us but don&apos;t have an account? {" "}
                              <Link href="/register" className="underline">
                                Sign up
                              </Link>
                            </div>
                          </form>
                        </Form>

                            
                      </TabsContent>
                  </div>
                </Tabs>
              </AuthCard>

          </div>

        </div>
      </div>
    </>
  )
}
