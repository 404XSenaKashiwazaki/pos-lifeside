"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart, Dashboards } from "../queries";
const CardDashboard = dynamic(() => import("./card-dashboard"), {
  loading: () => (
    <div>
      <Skeleton className="w-full h-20 mb-1" />
    </div>
  ),
  ssr: false,
});

const DashboardChart = dynamic(() => import("./chart"), {
  loading: () => (
    <div>
      <Skeleton className="w-full h-52" />
    </div>
  ),
  ssr: false,
});

const CardSection: React.FC<Dashboards & {dataChart: Chart[]}> = ({
  totalRevenue,
  totalOrders,
  activeProductions,
  paidPayments,
  notYetPaid,
  dataChart
}) => {
  return (
    <div>
      <CardDashboard
        paidPayments={paidPayments}
        activeProductions={activeProductions}
        totalOrders={totalOrders}
        totalRevenue={totalRevenue}
        notYetPaid={notYetPaid}
      />
       <DashboardChart  data={dataChart ?? []} />
    </div>
  );
};

export default CardSection;
