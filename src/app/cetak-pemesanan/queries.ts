"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { PrintOrders } from "@/types/datatable";
import { Response } from "@/types/response";
import { OrderStatus } from "@prisma/client";

interface ByOrdersProps {
  id: string[];
  status: string;
}
export const byOrders = async ({
  id,
  status,
}: ByOrdersProps): Promise<Response<PrintOrders[]>> => {
  try {
    const res = await prisma.order.findMany({
      where: {
        status: status as OrderStatus,
        id: {
          in: id,
        },
      },
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
        message: "Mendapatkan data pembayaran",
      });
    return sendResponse({
      success: true,
      message: "Mendapatkan data pembayaran",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mendapatkan data pembayaran",
    });
  }
};
