import React from "react";
import CardReport from "./card-report";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${(process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".","") ?? ``} - Laporan`,
};
const Page = () => {
  return (
    <div className="container mx-auto py-10">
      <CardReport />
    </div>
  );
};

export default Page;
