import { type Response } from "@/types/response";

export const sendResponse = <T>({ 
    message,
    success,
    data,
    error
 } : Response<T>) : Response<T> => {
  return { success, message, data,error };
};
