"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer, PaymentMethods, Product, SablonType, User } from "@prisma/client";
import { ColumnOrderTypeDefProps } from "@/types/datatable";
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
  data: ColumnOrderTypeDefProps[];
  customers: Customer[];
  handles: User[];
  sablons: SablonType[];
  products: Product[];
  payments : PaymentMethods[]
}
const TableSection: React.FC<TableSectionProps> = ({
  data,
  customers,
  handles,
  sablons,
  products,
  payments
}) => {
  return (
    <div>
      <DataTable
        products={products}
        data={data}
        sablon={sablons}
        handle={handles}
        customer={customers}
        payments={payments}
      />
    </div>
  );
};

export default TableSection;
