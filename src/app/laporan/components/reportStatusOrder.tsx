"use client";
import CardStatusOrder from "@/components/CardStatusOrder";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import ChartStatusOrder from "@/components/ChartStatusOrder";
import FormStatusOrder from "@/components/FormStatusOrder";

import { Customer, OrderStatus, Prisma } from "@prisma/client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ByStatusOrdersToCard,
  getByStatusOrdersToCart,
  getByStatusOrdersToCartRes,
  getOrdersStatus,
} from "../queries";
import { toast } from "sonner";
import DataTable from "@/app/pemesanan/components/data-table";
import TableStatusOrder from "./tableStatusOrder";

const ReportStatusOrder = () => {
  const date = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(date);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | string>("");
  const [orders, setOrders] = useState<
    Prisma.OrderGetPayload<{
      include: {
        customer: true;
        designs: true;
        items: {
          include: {
            products: true;
          };
        };
        payments: true;
      };
    }>[]
  >();
  const [chartOrders, setChartOrders] =
    useState<getByStatusOrdersToCartRes[]>();

  const getAllStatusOrders = async () => {
    try {
      const { data, success, error } = await getOrdersStatus(orderStatus);
      if (success && Array.isArray(data)) setOrders(data);
      if (error) toast.error("Ops...");
    } catch (error) {
      toast.error("Ops...");
    }
  };

  const getAllStatusOrdersChart = async () => {
    try {
      const { data, success, error } = await getByStatusOrdersToCart();
      if (success && Array.isArray(data)) setChartOrders(data);
      if (error) toast.error("Ops...");
    } catch (error) {
      toast.error("Ops...");
    }
  };

  useEffect(() => {
    setOrderStatus(localStorage.getItem("reportStatusOrder") ?? "");
    if (orderStatus) getAllStatusOrders();
    getAllStatusOrdersChart();
  }, [orderStatus]);

  return (
    <div className="mb-2 md:mb-5">
      <FormStatusOrder
        startDate={startDate}
        endDate={endDate}
        orderStatus={orderStatus}
        setOrderStatus={setOrderStatus}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
      <div>
        {orderStatus !== "" ? (
          <TableStatusOrder status={orderStatus} data={orders ?? []} />
        ) : (
          ""
        )}
        <ChartStatusOrder data={chartOrders ?? []} />
      </div>
    </div>
  );
};

export default ReportStatusOrder;
