"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { ColumnOrderTypeDefProps } from "@/types/datatable";
import { Response } from "@/types/response";
import { Order, Prisma } from "@prisma/client";

export const getOrders = async (): Promise<
  Response<ColumnOrderTypeDefProps[]>
> => {
  try {
    const res = await prisma.order.findMany({
      include: {
        items: {
          include: {
            production: true,
            products: true,
          },
        },
        customer: true,
        designs: true,
      },orderBy: {
        id: "desc"
      }
    });

    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data order",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data order",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data order",
    });
  }
};

export const getOrderById = async (
  id: string
): Promise<
  Response<
    Prisma.OrderGetPayload<{
      include: {
        customer: true;
        payments: true;
        items: {
          include: {
            products: true;
            production: {
              include: { sablonType: true };
            };
          };
        };
        designs: true;
      };
    }>
  >
> => {
  if (!id)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data order",
    });
  try {
    const res = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        payments: true,
        items: {
          include: {
            products: true,
            production: {
              include: { sablonType: true },
            },
          },
        },
        designs: true,
      },
    });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data order",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data order",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data order",
    });
  }
};
