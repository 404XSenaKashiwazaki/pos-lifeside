import { Metadata } from "next";
import React from "react";
import { getDashboards, getDataForChart } from "./queries";
import CardSection from "./components/card";
export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Dashboard`,
};

const Page = async () => {
  const { data } = await getDashboards();
  const { data: dataChart } = await getDataForChart();

  if (!data) return null;

  const {
    totalRevenue,
    activeProductions,
    totalOrders,
    paidPayments,
    notYetPaid,
  } = data;
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <CardSection
          paidPayments={paidPayments}
          activeProductions={activeProductions}
          totalOrders={totalOrders}
          totalRevenue={totalRevenue}
          notYetPaid={notYetPaid}
          dataChart={dataChart ?? []}
        />
      </div>
    </div>
  );
};

export default Page;
