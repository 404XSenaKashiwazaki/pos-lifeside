import React from "react";
import { getPayments } from "./queries";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import TableSection from "./components/table";
import { getPaymentMethods } from "../metode-pembayaran/queries";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Pembayaran`,
};
const Page = async () => {
  const { data } = await getPayments();
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      designs: true,
      items: {
        include: {
          products: true,
        },
      },
      payments: true,
    }, 
  });

  const { data: payments } = await getPaymentMethods();

  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection
          data={data ?? []}
          orders={orders ?? []}
          payments={payments ?? []}
        />
      </div>
    </div>
  );
};

export default Page;
