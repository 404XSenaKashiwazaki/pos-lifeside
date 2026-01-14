import React from "react";
import { Metadata } from "next";
import CardSection from "./components/card";

export const metadata: Metadata = {
  title: `${(process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".","") ?? ``} - Pengaturan`,
};
const Page = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <CardSection />
      </div>
    </div>
  );
};

export default Page;
