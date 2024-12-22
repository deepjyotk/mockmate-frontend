import { appConfig } from "@/config/appConfig";
import axios from "axios";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const API_HOST = appConfig.judge0ApiHost;
const API_KEY = appConfig.judge0ApiKey;


interface Status {
  id: number;
  description: string;
}

export interface Judge0Data {
  stdout: string | null;
  time: string | null;
  memory: string | null;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: Status;
}

interface Headers {
  'cache-control': string;
  'content-type': string;
}

interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

interface Config {
  transitional: Transitional;
  adapter: string[];
  transformRequest: Array<null>;
  transformResponse: Array<null>;
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Record<string, unknown>;
  headers: {
    Accept: string;
    'X-RapidAPI-Host': string;
    'X-RapidAPI-Key': string;
  };
  method: string;
  url: string;
}

export interface ApiResponse {
  data: Judge0Data;
  status: number;
  statusText: string;
  headers: Headers;
  config: Config;
  request: Record<string, unknown>;
}

export interface Judge0Payload{
  data: ApiResponse ;
}

/**
 * Submits code to Judge0 for execution.
 * @param sourceCode - The source code to execute.
 * @param languageId - The ID of the programming language.
 * @param stdin - Optional standard input for the program.
 * @returns The token to retrieve the submission result.
 */
export const submitCode = async (
  sourceCode: string,
  languageId: number,
  stdin: string = ""
): Promise<string> => {
  try {
    const base64SourceCode = Buffer.from(sourceCode).toString('base64');  // Convert source code to base64 encoding

    const response = await axios.post(
      `${JUDGE0_API_URL}?base64_encoded=true&wait=false`, // Send base64 encoded code
      {
        source_code: base64SourceCode,
        language_id: languageId,
        stdin: stdin ? Buffer.from(stdin).toString('base64') : '', // Base64 encode stdin if provided
      },
      {
        headers: {
          "X-RapidAPI-Host": API_HOST,
          "X-RapidAPI-Key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.error) {
      throw new Error(`Judge0 API error: ${response.data.error.message}`);
    }

    return response.data.token; // Return the submission token
  } catch (error) {
    console.error("Error submitting code:", error);
    throw new Error("Failed to submit code.");
  }
};

/**
 * Retrieves the result of a submission from Judge0.
 * @param token - The token of the submission.
 * @returns The submission result.
 */


/**
 * Retrieves the result of a submission from Judge0.
 * @param token - The token of the submission.
 * @returns The submission result.
 */
export const getSubmissionResult = async (token: string): Promise<Judge0Data> => {
  try {
    const response = await axios.get(`${JUDGE0_API_URL}/${token}?base64_encoded=true`, { // Retrieve base64 encoded result
      headers: {
        "X-RapidAPI-Host": API_HOST,
        "X-RapidAPI-Key": API_KEY,
      },
    });
    var apiResponse : Judge0Data= response.data ;


    // If status is 400, throw error to stop polling
    if (response.status === 400) {
      throw { response, message: "Bad Request: 400 error" };
    }

    // Decode the result and any output (if available)
    if (apiResponse.stdout) {
      apiResponse.stdout = Buffer.from(apiResponse.stdout, 'base64').toString();
    }
    if (apiResponse.stderr) {
      apiResponse.stderr = Buffer.from(apiResponse.stderr, 'base64').toString();
    }

    if(apiResponse.compile_output){
      apiResponse.compile_output = Buffer.from(apiResponse.compile_output, 'base64').toString();
    }

    if(apiResponse.message){
      apiResponse.message = Buffer.from(apiResponse.message, 'base64').toString();
    }

    return apiResponse; // Return the decoded result
  } catch (error) {
    console.error("Error retrieving submission result:", error);
    throw new Error("Failed to retrieve submission result from Judge0.");
  }
};