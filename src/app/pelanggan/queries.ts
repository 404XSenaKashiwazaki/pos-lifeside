"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { Customer } from "@prisma/client";

export const getCustomers = async (): Promise<Response<Customer[]>> => {
  try {
    const res = await prisma.customer.findMany();
    if (!res)
      return sendResponse({
        success: false,
        message: "Mendapatkan data pelanggan",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data pelanggan",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data pelanggan",
    });
  }
};

export const getCustomerById = async (
  id: string
): Promise<Response<Customer>> => {
  if (!id)
    return sendResponse({
      success: false,
      message: "Mendapatkan data pelanggan",
    });
  try {
    const res = await prisma.customer.findUnique({ where: { id } });
    if (!res)
      return sendResponse({
        success: false,
        message: "Mendapatkan data pelanggan",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data pelanggan",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data pelanggan",
    });
  }
};
