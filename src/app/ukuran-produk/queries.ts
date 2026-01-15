"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { Size } from "@prisma/client";

export const getData = async (): Promise<Response<Size[]>> => {
  try {
    const res = await prisma.size.findMany({
       orderBy: {
        id: "desc"
      }
    });
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

export const getDataById = async (id: string): Promise<Response<Size>> => {
  if (!id)
    return sendResponse({
      success: false,
      message: "Mendapatkan data ukuran produk",
    });
  try {
    const res = await prisma.size.findUnique({ where: { id } });
    if (!res)
      return sendResponse({
        success: false,
        message: "Mendapatkan data ukuran produk",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data ukuran produk",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data ukuran produk",
    });
  }
};

export const getDataByName = async (name: string): Promise<Response<Size>> => {
  if (!name)
    return sendResponse({
      success: false,
      message: "Mendapatkan data ukuran produk",
    });
  try {
    const res = await prisma.size.findFirst({ where: { name } });
    if (!res)
      return sendResponse({
        success: false,
        message: "Mendapatkan data ukuran produk",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data ukuran produk",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data ukuran produk",
    });
  }
};
