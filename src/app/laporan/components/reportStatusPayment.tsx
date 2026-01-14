"use client";

import ChartStatusOrder from "@/components/ChartStatusOrder";
import ChartStatusPayment from "@/components/ChartStatusPayment";
import FormStatusPayment from "@/components/FormStatusPayment";
import { PaymentStatus, Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  getByStatusPaymentsToCartRes,
  getByStatusPaymentToCart,
  getPaymentsStatus,
} from "../queries";
import { toast } from "sonner";
import TableStatusPayment from "./tableStatusPayments";

const ReportStatusPayment = () => {
  const date = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(date);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | string>(
    ""
  );
  const [payments, setPayments] = useState<
    Prisma.PaymentGetPayload<{
      include: {
        order: {
          include: {
            designs: true;
            items: {
              include: {
                products: true;
              };
            };
            customer: true;
          };
        };
      };
    }>[]
  >();
  const [chartPayments, setChartPayments] =
    useState<getByStatusPaymentsToCartRes[]>();

  const getAllStatusPayments = async () => {
    try {
      const { data, success, error } = await getPaymentsStatus(paymentStatus);
      if (success && Array.isArray(data)) setPayments(data);
      if (error) toast.error("Ops...");
    } catch (error) {
      toast.error("Ops...");
    }
  };

  const getAllStatusPaymentsChart = async () => {
    try {
      const { data, success, error } = await getByStatusPaymentToCart();
      if (success && Array.isArray(data)) setChartPayments(data);
      if (error) toast.error("Ops...");
    } catch (error) {
      toast.error("Ops...");
    }
  };

  useEffect(() => {
    setPaymentStatus(localStorage.getItem("reportStatusPayments") ?? "");
    if (paymentStatus) getAllStatusPayments();
    getAllStatusPaymentsChart();
  }, [paymentStatus]);

  return (
    <div className="m-2 md:mt-5">
      <FormStatusPayment
        startDate={startDate}
        endDate={endDate}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
      {paymentStatus !== "" ? (
        <TableStatusPayment data={payments ?? []} status={paymentStatus} />
      ) : (
        ""
      )}
      <ChartStatusPayment data={chartPayments ?? []} />
    </div>
  );
};

export default ReportStatusPayment;
