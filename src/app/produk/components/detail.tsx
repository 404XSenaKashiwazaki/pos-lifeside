"use client";

import React, { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Product } from "@prisma/client";
import { getDataById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface DetailPembelianProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Product | null>(null);
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
      <div className="space-y-1 flex gap-3 flex-col">
        <Image
          src={data.fileUrl ?? ""}
          alt="image"
          width={500}
          height={500}
          priority
          className="w-full h-full rounded-sm"
        />
        <div className="w-full">
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
              Sku
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.sku ?? "-"}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Ukuran
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.size ?? "-"}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Harga Beli/Modal
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.purchaseCost)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Harga Jual
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.sellingPrice ?? 0)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Warna
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.color}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Stok
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.stok ?? "-"}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Catatan
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.notes ?? "-"}</p>
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
    </div>
  );
};

export default DetailPage;
