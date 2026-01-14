import { ZodError } from "zod";

export interface Response<T> {
  success: boolean;
  message: string;
  data?: T | null;
  error?: ZodError | Error;
}
