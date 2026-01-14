"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = dynamic(() => import("./profile"), {
  loading: () => (
    <div className="flex flex-col sm:flex-row items-start gap-1">
      <Skeleton className="w-full max-w-sm  h-20 mb-1" />
      <Skeleton className="w-full  h-20 mb-1" />
    </div>
  ),
  ssr: false,
});

const CardSection: React.FC = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default CardSection;
