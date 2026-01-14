import React from "react";
import { getData, getSize } from "./queries";
import { Metadata } from "next";
import TableSection from "./components/table";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Produk`,
};
const Page = async () => {
  const { data } = await getData();
  const {data:sizes} = await getSize()
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection data={data ?? []} sizes={sizes ?? []} />
      </div>
    </div>
  );
};

export default Page;
