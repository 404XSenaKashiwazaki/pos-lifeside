import React from "react";
import { getData  } from "./queries";
import { Metadata } from "next";
import TableSection from "./components/table";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Ukuran Produk`,
};
const Page = async () => {
  const { data } = await getData();
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection data={data ?? []} />
      </div>
    </div>
  );
};

export default Page;
