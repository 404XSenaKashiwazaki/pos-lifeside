"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

export type ByStatusOrdersToCard = {
  status: OrderStatus;
  countCurrentMonth: number;
  countLastMonth: number;
  percent: number;
};

export const getOrdersStatus = async (
  status: string
): Promise<
  Response<
    Prisma.OrderGetPayload<{
      include: {
        customer: true;
        designs: true;
        items: {
          include: { products: true };
        };
        payments: true;
      };
    }>[]
  >
> => {
  try {
    const resAll = await prisma.order.findMany({
      where: {
        status: (status as OrderStatus) || OrderStatus.PENDING,
      },
      include: {
        customer: true,
        designs: true,
        items: {
          include: { products: true },
        },
        payments: true,
      },
    });
    if (!resAll)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pemesanan",
      });

    return sendResponse({
      success: true,
      message: "Berhasil",
      data: resAll,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pemesanan",
    });
  }
};

export interface getByStatusOrdersToCartRes {
  date: string;
  pending: number;
  confirmed: number;
  processing: number;
  printing: number;
  finishing: number;
  completed: number;
  cancelled: number;
  on_hold: number;
}
export const getByStatusOrdersToCart = async (): Promise<
  Response<getByStatusOrdersToCartRes[]>
> => {
  const stats: Record<string, getByStatusOrdersToCartRes> = {};
  const statusMap: Record<OrderStatus, keyof getByStatusOrdersToCartRes> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    PRINTING: "printing",
    FINISHING: "finishing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    ON_HOLD: "on_hold",
  };
  try {
    const orders = await prisma.order.findMany({
      select: {
        status: true,
        createdAt: true,
      },
    });

    for (const order of orders) {
      const date = order.createdAt.toISOString().split("T")[0];

      if (!stats[date]) {
        stats[date] = {
          date,
          pending: 0,
          confirmed: 0,
          processing: 0,
          printing: 0,
          finishing: 0,
          completed: 0,
          cancelled: 0,
          on_hold: 0,
        };
      }

      const key = statusMap[order.status];
      (stats[date][key] as number) += 1;
    }

    return sendResponse({
      success: true,
      message: "Berhasil",
      data: Object.values(stats).sort((a, b) => (a.date > b.date ? 1 : -1)),
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};

export interface getByStatusPaymentsToCartRes {
  date: string;
  pending: number;
  paid: number;
  failed: number;
  refunded: number;
}
export const getByStatusPaymentToCart = async (): Promise<
  Response<getByStatusPaymentsToCartRes[]>
> => {
  const stats: Record<string, getByStatusPaymentsToCartRes> = {};
  const statusMap: Record<PaymentStatus, keyof getByStatusPaymentsToCartRes> = {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
  };
  try {
    const payments = await prisma.payment.findMany({
      select: {
        status: true,
        createdAt: true,
        paidAt: true,
      },
    });

    for (const payment of payments) {
      if (payment.paidAt) {
        const date = payment.paidAt.toISOString().split("T")[0];

        if (!stats[date]) {
          stats[date] = {
            date,
            pending: 0,
            paid: 0,
            failed: 0,
            refunded: 0,
          };
        }

        const key = statusMap[payment.status];
        (stats[date][key] as number) += 1;
      }
    }

    return sendResponse({
      success: true,
      message: "Berhasil",
      data: Object.values(stats).sort((a, b) => (a.date > b.date ? 1 : -1)),
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};

export const getPaymentsStatus = async (
  status: string
): Promise<
  Response<
    Prisma.PaymentGetPayload<{
      include: {
        order: {
          include: {
            designs: true;
            items: {
              include: { products: true };
            };
            customer: true;
          };
        };
      };
    }>[]
  >
> => {
  try {
    const resAll = await prisma.payment.findMany({
      where: {
        status: (status as PaymentStatus) || PaymentStatus.PAID,
      },
      include: {
        order: {
          include: {
            designs: true,
            items: {
              include: { products: true },
            },
            customer: true,
          },
        },
      },
    });

    if (!resAll)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pembayaran",
      });

    return sendResponse({
      success: true,
      message: "Berhasil",
      data: resAll,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};
