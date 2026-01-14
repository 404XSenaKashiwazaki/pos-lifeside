"use client";
import React, { useEffect, useState, useTransition } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { SablonType } from "@prisma/client";
import { getHargaJenisById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailHargaJenisProps {
  id: string | null;
}

const DetailHargaJenis = ({ id }: DetailHargaJenisProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<SablonType | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getHargaJenisById(id);
        setData(data ?? null);
      }
    });
  }, []);

  if (isPending) return <Skeleton className="w-full h-52"/>;
  if(!data) return <div>Tidak Ada Data.</div>
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Nama
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p>{data.name ?? "-"}</p></span>
        </div>
          <div className="flex  flex-col sm:flex-row gap-1 items-center justify-between text-sm  ">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Modal Awal
          </span>
          <span className="font-xs text-primary w-full  flex items-start gap-1">
            <p>:</p> <p>{formatCurrency(Number(data.baseCost)) ?? "-"}</p>
          </span>
        </div>
         <div className="flex  flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Modal Per Warna
          </span>
          <span className="font-xs text-primary w-full  flex items-start gap-1">
            <p>:</p> <p>{formatCurrency(Number(data.costPerColor)) ?? "-"}</p>
          </span>
        </div>
         <div className="flex  flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Modal Per Area
          </span>
          <span className="font-xs text-primary w-full  flex items-start gap-1">
            <p>:</p> <p>{formatCurrency(Number(data.costPerArea)) ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm mt-2 sm:mt-4">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Harga dasar
          </span>
          <span className="font-xs text-primary w-full  flex items-start gap-1">
            <p>:</p> <p>{formatCurrency(Number(data.basePrice)) ?? "-"}</p>
          </span>
        </div>
        <div className="flex  flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Harga Per Warna 
          </span>
          <span className="font-xs text-primary w-full  flex items-start gap-1">
            <p>:</p> <p>{formatCurrency(Number(data.pricePerColor)) ?? "-"}</p>
          </span>
        </div>
         <div className="flex  flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Harga Per Area
          </span>
          <span className="font-xs text-primary w-full  flex items-start gap-1">
            <p>:</p> <p>{formatCurrency(Number(data.pricePerArea)) ?? "-"}</p>
          </span>
        </div>
       
        <div className="flex  flex-col sm:flex-row gap-1 items-start text-sm justify-between ">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Deskripsi
          </span>
          <span className="font-xs text-primary w-full flex items-start gap-1">
            <p>:</p> <p>{data.description ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-start text-sm justify-center ">
          <span className="flex items-center gap-1 text-muted-foreground w-full">
            Catatan
          </span>
          <span className="font-xs text-primary w-full  flex items-start gap-1"><p>:</p> <p>{data.notes ?? "-"}</p></span>
        </div>
      </div>
    </div>
  );
};

export default DetailHargaJenis;
