"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@prisma/client";
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
  data: Customer[];
}
const TableSection: React.FC<TableSectionProps> = ({ data }) => {
  return (
    <div>
      <DataTable data={data} />
    </div>
  );
};

export default TableSection;
