"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
import { Response } from "@/types/response";

export const getPayments = async (): Promise<
  Response<ColumnPaymentTypeDefProps[]>
> => {
  try {
    const res = await prisma.payment.findMany({
      include: {
         method: true,
        order: {
          include: {
            customer: true,
            designs: true,
            items: {
              include: {
                products: true,
              },
            },
          },
        },
      }, orderBy:{
        id: "desc"
      }
    });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pembayaran",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data pembayaran",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};

export const getPaymentById = async (
  id: string
): Promise<Response<ColumnPaymentTypeDefProps>> => {
  if (!id)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  try {
    const res = await prisma.payment.findUnique({
      where: { id },
      include: {
        method: true,
        order: {
          include: {
            customer: true,
            designs: true,
            items: {
              include: {
                products: true,
                production: {
                  include: { sablonType: true },
                },
              },
            },
          },
        },
      },
    });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pembayaran",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data pembayaran",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};
