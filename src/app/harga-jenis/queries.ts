"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { SablonType } from "@prisma/client";

export const getHargaJenis = async (): Promise<Response<SablonType[]>> => {
  try {
    const res = await prisma.sablonType.findMany({
      orderBy: {
        id: "desc"
      }
    });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data harga & jenis",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data harga & jenis",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data harga & jenis",
    });
  }
};

export const getHargaJenisById = async (
  id: string
): Promise<Response<SablonType>> => {
  if (!id)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data harga & jenis",
    });
  try {
    const res = await prisma.sablonType.findUnique({ where: { id } });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data harga & jenis",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data harga & jenis",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data harga & jenis",
    });
  }
};
