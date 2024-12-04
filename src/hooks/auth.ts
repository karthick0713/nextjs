import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useRef } from 'react'
import { AxiosResponse } from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { registrationFormSchema } from '@/lib/formschemas'
import { z } from 'zod'

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware?: string
  redirectIfAuthenticated?: string
}) => {
  const router = useRouter()
  const params = useParams()
  const isRedirecting = useRef(false)
  const {
    data: user,
    error,
    mutate,
  } = useSWR('/api/user', () =>
    axios
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error

        router.push('/verify-email')
      }),
  )

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const handleRedirect = (path: string) => {
    console.log("handleRedirect user",user); 
    if(user.role === 1){
      router.push('/dashboard/admin')
      return
    }
    else if(user.role === 3){
      router.push('/dashboard/producer')
      return
    }
    
    if (isRedirecting.current) return
      console.log("handleRedirect user",user); 
    if (isRedirecting.current) return
    isRedirecting.current = true
    if (path.startsWith('http')) {
      console.log("handleRedirect startswith http path",path)
      window.location.href = path;
    } else {
      console.log("handleRedirect path",path)
      router.push(path);
    }
  }

  const register = async (data: 
    z.infer <typeof registrationFormSchema>
  ) => {
    try {
      await csrf()
      await axios.post('/register', data)
      mutate()
      // Handle redirection after successful registration
      if (redirectIfAuthenticated) {
        if (redirectIfAuthenticated.startsWith('http')) {
          window.location.href = redirectIfAuthenticated;
        } else {
          router.push(redirectIfAuthenticated);
        }
      }
    } catch (error) {
      throw error
    }
  }

  const login = async (data: {
    email: string
    password: string
    remember: boolean
  }) => {
    try {
      await csrf()
      const response = await axios.post('/login', data)
      await mutate()
      
      // Get user role from response
      //const userRole = response.data.user.role;
      
      // Determine redirect path based on role
      // let redirectPath = '/dashboard';
      // if (userRole === 1) {
      //   redirectPath = '/dashboard/admin';
      // } else if (userRole === 2) {
      //   redirectPath = '/dashboard';
      // } else if (userRole === 3) {
      //   redirectPath = '/dashboard/producer';
      // }

      // Handle redirection
      if (redirectIfAuthenticated) {
        handleRedirect(redirectIfAuthenticated);
      } else {
        handleRedirect("");
      }
    } catch (error) {
      throw error
    }
  }

  const producerLogin = async (data: {
    agent_code: string
    password: string
    remember: boolean
    role:string
  }) => {
    try {
      await csrf()
      await axios.post('/login', data)
      mutate()
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (data: {
    email: string
  }): Promise<AxiosResponse> => {
    try {
      await csrf()
      return await axios.post('/forgot-password', data)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (data: {
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      await csrf()

      const response = await axios.post('/reset-password', {
        ...data,
        token: params.token,
      })

      router.push('/login?reset=' + btoa(response.data.status))
    } catch (error) {
      throw error
    }
  }

  const resendEmailVerification = async () => {
    try {
      return await axios.post('/email/verification-notification')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    if (!error) {
      await axios.post('/logout').then(() => mutate())
    }

    window.location.pathname = '/'
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      handleRedirect(redirectIfAuthenticated);
      //router.push(redirectIfAuthenticated)
    }

    if (
      window.location.pathname === '/verify-email' &&
      user?.email_verified_at &&
      redirectIfAuthenticated
    ) {
      handleRedirect(redirectIfAuthenticated);
    }
    if (middleware === 'auth' && error) logout()
  }, [user, error, middleware, redirectIfAuthenticated])

  return {
    user,
    register,
    login,
    producerLogin,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  }
}
