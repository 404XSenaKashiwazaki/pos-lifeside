"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
const ReportStatusOrder = dynamic(() => import("./components/reportStatusOrder"), {

  loading: () => (
    <div>
      <Skeleton className="w-full h-20 mb-1" />
    </div>
  ),
  ssr: false,
});

const ReportStatusPayment = dynamic(() => import("./components/reportStatusPayment"), {

  loading: () => (
    <div>
      <Skeleton className="w-full h-20 mb-1" />
    </div>
  ),
  ssr: false,
});
const CardReport = () => {
  return (
    <div className="flex flex-col gap-1">
      <ReportStatusOrder />
      <ReportStatusPayment />
    </div>
  );
};

export default CardReport;
