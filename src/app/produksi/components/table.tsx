"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {  SablonType, User } from "@prisma/client";
import {
  ColumnProductionTypeDefProps,
} from "@/types/datatable";
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
  data: ColumnProductionTypeDefProps[];
  handle: User[];
  sablon: SablonType[];
}
const TableSection: React.FC<TableSectionProps> = ({
  data,
  handle,
  sablon,
}) => {
  return (
    <div>
      <DataTable data={data} sablon={sablon} handle={handle} />
    </div>
  );
};

export default TableSection;
