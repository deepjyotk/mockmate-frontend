'use client';
// src/services/axiosClient.ts
import axios from 'axios';
import { appConfig } from '@/config/appConfig';
import Cookies from 'js-cookie'; // For client-side cookie handling


// Create an Axios instance
const axiosClient = axios.create({
  baseURL: appConfig.apiBaseUrl,  // Use your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken'); // Retrieve the token from client-side cookies

    // Use AxiosHeaders to set headers dynamically
    if (accessToken) {
      if (!config.headers) {
        config.headers = new axios.AxiosHeaders();
      }

      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Ensure the Content-Type header is always set
    if (config.headers) {
      config.headers.set('Content-Type', 'application/json');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 404 or 401 errors for expired tokens
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log(error.response);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;