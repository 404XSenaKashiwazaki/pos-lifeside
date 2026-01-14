"use client";
import React, { useEffect, useState, useTransition } from "react";
import { PaymentMethods } from "@prisma/client";
import { getPaymentMethodsById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface DetailPembelianProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<PaymentMethods | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getPaymentMethodsById(id);
        setData(data ?? null);
      }
    });
  },[]);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e.}))
if(isPending) return <Skeleton className="w-full h-52"/>
  if (!data) return <div>Tidak Ada Data.</div>;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
          Nama
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p className="capitalize">{data.name ?? "-"}</p></span>
        </div>
         <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
           Nomor
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><Card className="rounded-sm px-4 py-1 border-0"><p>{data.no ?? "-"}</p></Card></span>
        </div>
         <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
           Deskripsi
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p>{data.description ?? "-"}</p></span>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
