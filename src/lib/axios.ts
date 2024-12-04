import Axios, { AxiosInstance } from 'axios'

const axios: AxiosInstance = Axios.create({
  // Base URL for all requests
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,

  // Default headers
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Default request options
  
    // Whether to send cookies, defaults to true
    withCredentials: true,

    // Whether to include the XSRF token, defaults to false
    withXSRFToken: true,
    //  xsrfCookieName: 'XSRF-TOKEN',
    //  xsrfHeaderName: 'X-XSRF-TOKEN',
  });
 

export default axios
