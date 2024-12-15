// src/config/config.ts

interface AppConfig {
    apiBaseUrl: string;
    secretKey: string;
    wsServiceBaseUrl: string | undefined;
  }
  
  export const loadConfig = (): AppConfig => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const wsServiceBaseUrl  = process.env.NEXT_PUBLIC_WEB_SOCKET_SERVICE_BASE_URL ;
    
  
    if (!apiBaseUrl){
        throw new Error('Environment variable NEXT_PUBLIC_API_BASE_URL is not defined');
    }

    if (!secretKey) {
      throw new Error('Environment variable NEXT_PUBLIC_SECRET_KEY is not defined');
    }
    
    return {
    apiBaseUrl,
    secretKey,
    wsServiceBaseUrl
    };
  };
  
  export const appConfig = loadConfig();
  