"use client";
import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Size } from "@prisma/client";
import { getDataById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailPembelianProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Size | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getDataById(id);
        setData(data ?? null);
      }
    });
  }, []);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e.}))
  if (isPending) return <Skeleton className="w-full h-52" />;
  if (!data) return <div>Tidak Ada Data.</div>;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Nama
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.name ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Lebar dada
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{`${data.chest} cm`}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Panjang badan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{`${data.length} cm`}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Panjang lengan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{`${data.sleeve} cm`}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Catatan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.note ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Created At
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{format(data.createdAt, "PPP")}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
