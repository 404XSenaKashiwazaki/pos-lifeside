"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { PaymentMethods, User } from "@prisma/client";

export const getPaymentMethods = async (): Promise<
  Response<PaymentMethods[]>
> => {
  try {
    const res = await prisma.paymentMethods.findMany();
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data user",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data user",
    });
  }
};

export const getPaymentMethodsById = async (
  id: string
): Promise<Response<PaymentMethods>> => {
  if (!id)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data user",
    });
  try {
    const res = await prisma.paymentMethods.findUnique({ where: { id } });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data user",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data user",
    });
  }
};
