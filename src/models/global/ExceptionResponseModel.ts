// ExceptionResponseModel.ts
export interface ExceptionResponseModel {
    requestId: string;
    timestamp: string; // ISO date string
    message: string;
    status: number;    // HTTP status code, e.g., 400, 500
    error: string;
    details: { [key: string]: string };
  }
  