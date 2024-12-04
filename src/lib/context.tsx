import { set } from 'date-fns';
import React, { createContext, useContext, useState, ReactNode } from 'react';
interface PaymentDetails {
  quoteId: string;
  amount: string;
  clientToken: string;
}


interface PaymentSuccessData {
  email: string;
  last_id: string | null;
  policy_no: string;
  quote_id: string;
  upload_insurance_file: string;
  mail_response: boolean;
}


type DataContextType<T> = {
  data: T | null;
  setData: (data: T | null) => void;
  qualifierResponse: string | null;
  setQualifierResponse: (response: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  paymentDetails: PaymentDetails;
  setPaymentDetails: (details: PaymentDetails) => void;
  paymentSuccessData: PaymentSuccessData | null;
  setPaymentSuccessData: (data: PaymentSuccessData | null) => void;
};

const DataContext = createContext<DataContextType<any> | undefined>(undefined);

type DataProviderProps<T> = {
  children: ReactNode;
  initialData?: T | null;
};

export function DataProvider<T>({ children, initialData = null }: DataProviderProps<T>) {
  const [data, setData] = useState<T | null>(initialData);
  const [qualifierResponse, setQualifierResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    quoteId: '',
    amount: '',
    clientToken: ''
  });
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentSuccessData | null>(null);
  const value = {
    data,
    setData,
    qualifierResponse,
    setQualifierResponse,
    isLoading,
    setIsLoading,
    error,
    setError,
    paymentDetails,
    setPaymentDetails,
    paymentSuccessData,
    setPaymentSuccessData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData<T>(): DataContextType<T> {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context as DataContextType<T>;
}