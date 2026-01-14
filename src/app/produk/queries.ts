"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { Product, Size } from "@prisma/client";


export const getData= async (): Promise<Response<Product[]>> => {
  try {
    const res = await prisma.product.findMany();
    if (!res)
      return sendResponse({
        success: false,
        message: "Mendapatkan data produk",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data produk",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data produk",
    });
  }
};

export const getSize= async (): Promise<Response<Size[]>> => {
  try {
    const res = await prisma.size.findMany();
    if (!res)
      return sendResponse({
        success: false,
        message: "Mendapatkan data ukuran",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data ukuran",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data ukuran",
    });
  }
};


export const getDataById = async (id: string): Promise<Response<Product>> => {
  if(!id) return sendResponse({
        success: false,
        message: "Mendapatkan data produk",
      });
  try {
    const res = await prisma.product.findUnique({ where: {id}});
    if (!res)
      return sendResponse({
        success: false,
        message: "Mendapatkan data produk",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data produk",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data produk",
    });
  }
};

