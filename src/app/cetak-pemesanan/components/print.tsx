"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
const CardSection = dynamic(() => import("./order"), {
  loading: () => (
    <div>
      <Skeleton className="w-full h-20 mb-1" />
    </div>
  ),
  ssr: false,
});

interface PrintSectionProps {
  id: string[];
  status: string;
}

const PrintSection: React.FC<PrintSectionProps> = ({ id, status }) => {
  return <CardSection id={id} status={status.toUpperCase()} />;
};

export default PrintSection;
