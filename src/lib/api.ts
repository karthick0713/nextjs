import { toast } from '@/components/ui/use-toast';
import axios from './axios';
import { AxiosError } from 'axios';
import { Toast } from '@/components/ui/toast';
import { RAPAutoRenewalFormSchema, SecondYearPaymentFormSchema } from './formschemas';
import { z } from 'zod';
import { AdminCreateUserRequest, AdminCreateUserResponse, PDFDownloadResponse } from './models';

interface SupportedState {
  program: string;
  stateCode: string;
  state: string;
}

interface SupportedStateResponse {
  status: number;
  message: string;
  data: Record<string, Record<string, string>>;
}

interface ApiResponse {
    status: string;
    message: string;
    data: string;
  }
const SUPPORTED_STATES_URL = '/api/policy/supported-states';
const QUALIFIER_URL = '/api/policy/qualifier';
const SUBMITQUOTEREVIEW = '/api/quote/save';
const LOGIN_URL= '/login';
const REGISTER_URL= '/register';
const LOGOUT_URL= '/logout';
const USER_FORGOT_PASSWORD_URL= '/forgot-password';

const PRODUCER_LOGIN_URL= '/producer/login';
const PRODUCER_FORGOT_PASSWORD_URL= '/producer/forgot-password';
const SEND_VERIFICATION_URL = '/api/policy/sendEmail';

const AUTO_RENEWAL_SUBMIT_URL= '/api/policy/auto-renew';
const SECOND_YEAR_SUBMIT_URL= '/api/policy/second-year';
const PDF_DOWNLOAD_URL = 'https://api.axylerate.com/api/pdf-download';

const UPLOAD_DOCUMENT_URL = '/api/policy/upload-document';

export interface UploadDocumentResponse {
  status: string;
  message: string;
  data: {
    url: string;
  };
}

export const getSupportedStates = async (): Promise<SupportedState[]> => {
  try {
    const { data } = await axios.get<SupportedStateResponse>(SUPPORTED_STATES_URL);
    console.log(data.status);
    console.log(data.message);
    if (data.status !== 200) {
      throw new Error(`API Error: ${data.message}`);
    }

    const supportedStates: SupportedState[] = [];

    for (const [program, states] of Object.entries(data.data)) {
      for (const [stateCode, state] of Object.entries(states)) {
        supportedStates.push({ program, stateCode, state });
      }
    }

    return supportedStates;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  }
};

export const getQuote = async (
  program_code: string, 
  state: string, 
  currently_insurance: boolean, 
  ga_insurance: boolean, 
  effective_date: string, 
  expiry_date:string,
  policy_num: string): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(QUALIFIER_URL, {
      program_code,
      state,
      currently_insurance, 
      ga_insurance,
      effective_date,
      expiry_date,
      policy_num,
    });

    if (response.data.status === "error") {
      throw new Error(`API Error: ${response.data.message}`);
    }
    
    //assuming "success" or "renewal_status"
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {  // Check for error response message first
        throw new Error(error.response.data.message);
      } else if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};

export const submitForReview = async (data: string): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(SUBMITQUOTEREVIEW, data);

    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    console.log("submitForReview")
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};
export const userLogin = async (email: string, password: string, remember: boolean): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(LOGIN_URL, {
      email,
      password,
      remember,
    });

    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    console.log("userLogin")
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};

export const userRegister = async (name: string, email: string, password: string, remember: boolean): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(REGISTER_URL, {
      name,
      email,
      password,
      remember,
    });

    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    console.log("userRegister")
    console.log(response.data);
    return response.data.data;
  } catch (error) {      
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};

export const userLogout = async (): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(LOGOUT_URL);

    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    console.log("userLogout")
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};

export const producerLogin = async (producer_code: string, password: string, remember: boolean): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(PRODUCER_LOGIN_URL, {
      producer_code,
      password,
      remember,
    });

    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    console.log("producerLogin")
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};

export const userForgotPassword = async (email: string): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(USER_FORGOT_PASSWORD_URL, {
      email,
    });

    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    console.log("userForgotPassword")
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};

export const producerForgotPassword = async (producer_code: string): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(PRODUCER_FORGOT_PASSWORD_URL, {
      producer_code,
    });

    if (response.data.status !== "success") {
      throw new Error(`API Error: ${response.data.message}`);
    }
    console.log("producerForgotPassword")
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
    throw error;
  } 
};

// In api.ts, add:
const PAYMENT_URL = '/api/policy/pay';

interface PaymentResponse {
  message: string;
  status: string;
  data: {
    email: string;
    last_id: string | null;
    policy_no: string;
    quote_id: string;
    upload_insurance_file: string;
    mail_response: boolean;
  }
}

export const processPayment = async (
  quote_id: string, 
  payment_type:string, 
  policy_payment_type: string, 
  paymentMethod: any): Promise<PaymentResponse> => {
  try {

    const requestBody = {
      quote_id,
      payment_type,
      policy_payment_type: policy_payment_type,
      nonce: paymentMethod.nonce,
      details: null,
      type: paymentMethod.type,
      description: paymentMethod.description,
      binData: null
    };

    if(payment_type === 'card') {
      requestBody.details = paymentMethod.details;
      requestBody.binData = paymentMethod.binData;
    }else if(payment_type === 'ach_direct') {
      requestBody.type = 'us_bank_account';
      
    }
    else {
      throw new Error('Invalid payment method type');
    } 
  

    const response = await axios.post<PaymentResponse>(PAYMENT_URL, requestBody);

    if (response.data.status !== 'success') {
      toast({
        title: "Payment failed",
        description: response.data.status,
      });
      throw new Error(`API Error: ${response.data.message}`);
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      }
      throw new Error(`Request Error: ${error.message}`);
    }
    throw error;
  }
};


 

 export const sendVerificationCode = async (email: string): Promise<ApiResponse> => {
   try {
     const response = await axios.post<ApiResponse>(SEND_VERIFICATION_URL, { email });
     
     if (response.data.status !== 'success') {
       throw new Error(`API Error: ${response.data.message}`);
     }
     
     return response.data;
   } catch (error) {
     if (error instanceof AxiosError) {
       if (error.response) {
         throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
       } else if (error.request) {
         throw new Error('Network Error: No response received from the server');
       }
       throw new Error(`Request Error: ${error.message}`);
     }
     throw error;
   }
 };




 export const submitAutoRenewal = async (data: z.infer<typeof RAPAutoRenewalFormSchema>): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(AUTO_RENEWAL_SUBMIT_URL, data );
    
    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      }
      throw new Error(`Request Error: ${error.message}`);
    }
    throw error;
  }
};

export const submitSecondYearPayment = async (data: z.infer<typeof SecondYearPaymentFormSchema>): Promise<any> => {
  try {
    const response = await axios.post<ApiResponse>(SECOND_YEAR_SUBMIT_URL, data );
    
    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      }
      throw new Error(`Request Error: ${error.message}`);
    }
    throw error;
  }
};

export const downloadPDF = (quote_id: string): void => {
  window.location.href = `${PDF_DOWNLOAD_URL}?quote_id=${encodeURIComponent(quote_id)}`;
};



export const adminCreateUser = async (userData: AdminCreateUserRequest): Promise<AdminCreateUserResponse> => {
  try {
    const response = await axios.post<AdminCreateUserResponse>('/api/admin/create-user', userData);

    if (response.data.status !== 'success') {
      throw new Error(`API Error: ${response.data.message}`);
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response) {
        throw new Error(`HTTP Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from the server');
      }
      throw new Error(`Request Error: ${error.message}`);
    }
    throw error;
  }
};

export const uploadPdf = async (
  insurance_document: File,
  quote_id: string,
  policy_num: string,
  last_id: string
): Promise<UploadDocumentResponse> => {
  try {
    const formData = new FormData();
    formData.append('insurance_document', insurance_document);
    formData.append('quote_id', quote_id);
    formData.append('policy_num', policy_num);
    formData.append('last_id', last_id);

    const { data } = await axios.post<UploadDocumentResponse>(
      UPLOAD_DOCUMENT_URL,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (data.status !== '200') {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to upload document');
    }
    throw error;
  }
};