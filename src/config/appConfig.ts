// src/config/config.ts

interface AppConfig {
    apiBaseUrl: string;
    secretKey: string;
  }
  
  export const loadConfig = (): AppConfig => {
    // const apiAuthUrl = process.env.NEXT_PUBLIC_API_BASE_AUTH_URL;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    
  
    if (!apiBaseUrl){
        throw new Error('Environment variable NEXT_PUBLIC_API_BASE_URL is not defined');
    }

    if (!secretKey) {
      throw new Error('Environment variable NEXT_PUBLIC_SECRET_KEY is not defined');
    }
    
    return {
    apiBaseUrl,
    secretKey,
    };
  };
  
  export const appConfig = loadConfig();
  