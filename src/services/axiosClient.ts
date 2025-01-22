'use client';

import axios from 'axios';
import { appConfig } from '@/config/appConfig';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: appConfig.apiBaseUrl, // Use your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor to handle any request-specific logic
axiosClient.interceptors.request.use(
  async (config) => {
    // Since we're using HTTP-only cookies, there's no need to manually set the Authorization header
    // The browser will automatically include the cookie in requests

    // Ensure the Content-Type header is always set
    if (config.headers) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors globally
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response);
      // You can handle specific status codes here (e.g., 401, 403) if needed
    }
    return Promise.reject(error);
  }
);

export default axiosClient;