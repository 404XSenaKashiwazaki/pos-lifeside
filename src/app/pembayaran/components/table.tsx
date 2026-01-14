"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentMethods, Prisma } from "@prisma/client";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
const DataTable = dynamic(() => import("./data-table"), {
  loading: () => (
    <div>
      <Skeleton className="w-1/2 h-10 mb-1" />
      <Skeleton className="w-full h-96" />
    </div>
  ),
  ssr: false,
});

interface TableSectionProps {
  payments: PaymentMethods[];
  data: ColumnPaymentTypeDefProps[];
  orders: Prisma.OrderGetPayload<{
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
  }>[];
}
const TableSection: React.FC<TableSectionProps> = ({
  data,
  orders,
  payments,
}) => {
  return (
    <div>
      <DataTable data={data} orders={orders} payments={payments} />
    </div>
  );
};

export default TableSection;
