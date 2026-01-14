import React from "react";
import { getOrders } from "./queries";
import { getCustomers } from "../pelanggan/queries";
import { getUsers } from "../users/queries";
import { getHargaJenis } from "../harga-jenis/queries";
import { Metadata } from "next";
import TableSection from "./components/table";
import { getData } from "../produk/queries";
import { getPaymentMethods } from "../metode-pembayaran/queries";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Pemesanan`,
};
const Page = async () => {
  const { data } = await getOrders();
  const { data: customers } = await getCustomers();
  const { data: handles } = await getUsers();
  const { data: sablons } = await getHargaJenis();
  const { data: products } = await getData();
  const { data: payments } = await getPaymentMethods();
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection
          products={products ?? []}
          data={data ?? []}
          sablons={sablons ?? []}
          handles={handles ?? []}
          customers={customers ?? []}
          payments={payments ?? []}
        />
      </div>
    </div>
  );
};

export default Page;
