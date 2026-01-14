import React, { Suspense } from "react";
import { getHargaJenis } from "./queries";
import DataTable from "./components/data-table";
import { Metadata } from "next";
import TableSection from "./components/table";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Harga & Jenis`,
};
const Page = async () => {
  const { data } = await getHargaJenis();

  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection data={data ?? []} />
      </div>
    </div>
  );
};

export default Page;
