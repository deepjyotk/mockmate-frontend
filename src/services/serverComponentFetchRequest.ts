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
  const cookieStore = cookies(); // Fetch cookies synchronously
  const accessToken = (await cookieStore).get("accessToken")?.value; // Retrieve the "accessToken" cookie value

  const headers = {
    ...(options.headers || {}),
    ...(accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {}),
    "Content-Type": "application/json", // Add default content type
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers,
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
    console.error("Error fetching data:", error);

    
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
