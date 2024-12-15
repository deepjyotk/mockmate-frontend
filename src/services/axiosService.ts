/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "@/config/appConfig";
import axiosClient from "./axiosClient";
import CryptoJS from 'crypto-js';
import { LoginRequest } from "@/models/auth/loginRequest";
import { SignupRequest } from "@/models/auth/signup/signupRequest";
import { ResponseModel } from "@/models/global/ResponseModel";
import { SuccessfulResponseModel } from "@/models/global/SuccessResponseModel";
import { ExceptionResponseModel } from "@/models/global/ExceptionResponseModel";
import { ScheduleInterviewRequestModel } from "@/models/interview/init/ScheduleInterviewRequestModel";
import { Empty } from "@/types/Empty";
import { FeedbackRequestModel } from "@/models/feedback/FeedbackRequestModel";

export const axiosPostRequest = async (endpoint : string,  credentials : LoginRequest 
  | SignupRequest | ScheduleInterviewRequestModel | Empty | FeedbackRequestModel ): Promise<ResponseModel > => {
  try {
    const response = await axiosClient.post<SuccessfulResponseModel>(endpoint, credentials);
    return response.data as SuccessfulResponseModel;
  } catch (error: any) {
    console.error("Error during signup:", error);
    return error.response.data as ExceptionResponseModel ;
  }
};


export const axiosGetRequest = async (endpoint : string ): Promise<ResponseModel > => {
  try {
    const response = await axiosClient.get<SuccessfulResponseModel>(endpoint);
    return response.data as SuccessfulResponseModel;
  } catch (error: any) {
    // console.error("Error during signup:", error);
    return error.response.data as ExceptionResponseModel ;
  }
};


export const saveToken = (token: string): void => {
  const encryptedToken = CryptoJS.AES.encrypt(token, appConfig.secretKey).toString();
  localStorage.setItem('authToken', encryptedToken);
};

export const getToken = (): string | null => {
  const encryptedToken = localStorage.getItem('authToken');
  if (encryptedToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, appConfig.secretKey);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  }
  return null;
};

export const clearToken = (): void => {
  localStorage.removeItem('authToken');
};