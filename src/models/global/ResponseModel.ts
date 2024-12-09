import { ExceptionResponseModel } from "./ExceptionResponseModel";
import { SuccessfulResponseModel } from "./SuccessResponseModel";

export type ResponseModel = SuccessfulResponseModel | ExceptionResponseModel;
