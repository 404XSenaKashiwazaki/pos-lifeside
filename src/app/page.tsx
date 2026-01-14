import React from "react";
import Dashboard from "@/app/dashboard/page";
import { Metadata } from "next";

// import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Dashboard`,
};
const Page = () => {

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;
