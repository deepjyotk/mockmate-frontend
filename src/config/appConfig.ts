// src/config/config.ts

interface AppConfig {
  apiBaseUrl: string;
  secretKey: string;
  wsServiceBaseUrl: string | undefined;
  zegoAppId: string | undefined;
  zegoServerSecret: string | undefined;
  liveblocksSecretKey: string | undefined;
  judge0ApiHost: string | undefined;
  judge0ApiKey: string | undefined;
}

export const loadConfig = (): AppConfig => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const wsServiceBaseUrl = process.env.NEXT_PUBLIC_WEB_SOCKET_SERVICE_BASE_URL;
  const zegoAppId = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
  const zegoServerSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
  const liveblocksSecretKey = process.env.LIVEBLOCKS_SECRET_KEY;
  const judge0ApiHost = process.env.NEXT_PUBLIC_JUDGE0_API_HOST;
  const judge0ApiKey = process.env.NEXT_PUBLIC_JUDGE0_API_KEY;

  if (!apiBaseUrl) {
    throw new Error('Environment variable NEXT_PUBLIC_API_BASE_URL is not defined');
  }

  if (!secretKey) {
    throw new Error('Environment variable NEXT_PUBLIC_SECRET_KEY is not defined');
  }

  return {
    apiBaseUrl,
    secretKey,
    wsServiceBaseUrl,
    zegoAppId,
    zegoServerSecret,
    liveblocksSecretKey,
    judge0ApiHost,
    judge0ApiKey,
  };
};

export const appConfig = loadConfig();
