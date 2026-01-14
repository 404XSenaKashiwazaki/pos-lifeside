import React from "react";
import { getPaymentMethods } from "./queries";
import { Metadata } from "next";
import TableSection from "./components/table";
import { auth } from "@/auth";
import ForbiddenPage from "../403/page";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Users`,
};
const Page = async () => {
  const { data } = await getPaymentMethods();
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role?.toLowerCase() == "staff") return <ForbiddenPage />;
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection data={data ?? []} />
      </div>
    </div>
  );
};

export default Page;
