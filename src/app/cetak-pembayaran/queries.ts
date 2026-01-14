"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
import { Response } from "@/types/response";
import { Payment, PaymentStatus } from "@prisma/client";

interface ByPaymentsProps {
  id: string[];
  status: string;
}
export const byPayments = async ({
  id,
  status,
}: ByPaymentsProps): Promise<Response<ColumnPaymentTypeDefProps[]>> => {
  try {
    const res = await prisma.payment.findMany({
      where: {
        status: status as PaymentStatus,
        id: {
          in: id,
        },
      },
      include: {
        method: true,

        order: {
          include: {
            designs: true,
            customer: true,
            items: {
              include: {
                products: true,
                production: {
                  include: {
                    sablonType: true,
                  },
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
