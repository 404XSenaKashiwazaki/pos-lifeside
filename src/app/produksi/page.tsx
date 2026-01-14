import React from "react";
import { getProductions } from "./queries";
import { getUsers } from "../users/queries";
import { getHargaJenis } from "../harga-jenis/queries";
import { Metadata } from "next";
import TableSection from "./components/table";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Produksi`,
};
const Page = async () => {
  const { data } = await getProductions();
  const { data: handles } = await getUsers();
  const { data: sablons } = await getHargaJenis();
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection
          handle={handles ?? []}
          sablon={sablons ?? []}
          data={data ?? []}
        />
      </div>
    </div>
  );
};

export default Page;
