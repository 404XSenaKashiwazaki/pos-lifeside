"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";

export interface Dashboards {
  totalRevenue: number;
  totalOrders: number;
  activeProductions: number;
  paidPayments: number;
  notYetPaid?: number;
}
export const getDashboards = async (): Promise<Response<Dashboards>> => {
  try {
    const [orders, productions, payments] = await Promise.all([
      prisma.order.findMany({
        include: {
          payments: true,
        },
      }),
      prisma.production.findMany(),
      prisma.payment.findMany(),
    ]);

    // 🔹 Filter order yang belum ada pembayaran FINAL & PAID
    const notPaids = orders.filter(
      (o) =>
        o.payments.filter((p) => p.type === "FINAL" && p.status === "PAID")
          .length === 0
    );

    // 🔹 Hitung statistik
    const totalRevenue = payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalNotPaid = notPaids.length;
    const totalOrders = orders.length;

    const activeProductions = productions.filter(
      (p) => p.status !== "CANCELED"
    ).length;

    const paidPayments =
      payments.length > 0
        ? Math.round(
            (payments.filter((p) => p.status === "PAID").length /
              payments.length) *
              100
          )
        : 0;

    return sendResponse({
      success: true,
      message: "Berhasil menggambil data",
      data: {
        totalRevenue,
        totalOrders,
        activeProductions,
        paidPayments,
        notYetPaid: totalNotPaid,
      },
    });
  } catch (error) {
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal menggambil data",
    });
  }
};

export interface Chart {
  date: string;
  revenue: number;
  orders: number;
}
export const getDataForChart = async (): Promise<Response<Chart[]>> => {
  try {
    const res = await prisma.order.findMany({
      include: {
        payments: {
          where: {
            status: "PAID",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const resGroup: Record<string, Chart> = {};
    if (Array.isArray(res) && res.length > 0) {
      for (const val of res) {
        const date = val.createdAt.toISOString().split("T")[0];

        if (!resGroup[date])
          resGroup[date] = {
            date,
            orders: 0,
            revenue: 0,
          };
        resGroup[date].revenue += Number(val.totalAmount);
        resGroup[date].orders += 1;
      }
    }

    return sendResponse({
      success: true,
      message: "Berhasil menggambil data",
      data: Object.values(resGroup),
    });
  } catch (error) {
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal menggambil data",
    });
  }
};
