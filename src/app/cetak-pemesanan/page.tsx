import React, { use } from "react";
import { Metadata } from "next";
import PrintSection from "./components/print";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Cetak Laporan`,
};

type Params = Promise<{ id: string | string[]; status: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id, status } = use(props.searchParams);
  const toArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  return (
    <div className="container mx-auto py-10">
      <PrintSection id={toArray(id) ?? []} status={(status as string) ?? ""} />
    </div>
  );
}
