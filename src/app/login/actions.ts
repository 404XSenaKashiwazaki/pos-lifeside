"use server";
import { signIn } from "@/auth";

export const login = async (redirectTo: string, formdata: FormData) => {
  await signIn("google", { redirectTo });
};
