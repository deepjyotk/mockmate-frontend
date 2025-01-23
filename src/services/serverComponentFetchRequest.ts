'use server';
import { appConfig } from "@/config/appConfig";
import { ExceptionResponseModel } from "@/models/global/ExceptionResponseModel";
import { ResponseModel } from "@/models/global/ResponseModel";
import { SuccessfulResponseModel } from "@/models/global/SuccessResponseModel";
import { cookies } from "next/headers";

const backendBaseUrl = appConfig.apiBaseUrl;

const serverComponentFetchRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<SuccessfulResponseModel | ExceptionResponseModel> => {
  
  // Access cookies synchronously

  const cookieStore = await  cookies();
  const userCookies = Array.from(cookieStore.getAll() || [])
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join('; ');
  
  // const cookieStore = await cookies();
  // const serializedCookies = cookieStore?.toString();

  const fetchOptions: RequestInit = {
    
    ...options,
    credentials: 'include',  // Ensures cookies are sent cross-origin
    headers: {
      ...options.headers, // Existing headers
      Cookie: userCookies,
    },

  };
  
 const url = `${backendBaseUrl}/${endpoint}`;

  try {
    const response = await fetch(url, fetchOptions);
    const data: ResponseModel = await response.json();
    // Use your data here

    if("payload" in data ){
      return data as SuccessfulResponseModel;
    }else{
      return data ;
    }
  } catch (error) {
    console.error("Error fetching data :", error);

     
    // Return a constructed ExceptionModel
    return {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
      status: 500,
      error: "FETCH_ERROR",
      details: {},
    } as ExceptionResponseModel;
  }
  
};

export default serverComponentFetchRequest;
