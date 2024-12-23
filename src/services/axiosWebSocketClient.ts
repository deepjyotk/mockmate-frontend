// src/services/axiosWebSocketServiceClient.ts

'use client';

import axios from 'axios';
import { appConfig } from '@/config/appConfig';
import Cookies from 'js-cookie'; // For client-side cookie handling

// Create an Axios instance for WebSocket services
const axiosWebSocketServiceClient = axios.create({
  baseURL: appConfig.wsServiceBaseUrl, // WebSocket Service Base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
axiosWebSocketServiceClient.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken'); // Retrieve the token from client-side cookies

    // Use AxiosHeaders to set headers dynamically
    if (accessToken) {
      if (!config.headers) {
        config.headers = {};
      }

      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

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

// Response interceptor to handle specific HTTP errors
axiosWebSocketServiceClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific status codes if needed
      // Example:
      // if (status === 401) {
      //   // Token expired or unauthorized, redirect to login
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default axiosWebSocketServiceClient;
