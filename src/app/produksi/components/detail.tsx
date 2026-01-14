"use client";

import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductionById } from "../queries";
import { ColumnProductionTypeDefProps } from "@/types/datatable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Size } from "@prisma/client";
import { getDataByName } from "@/app/ukuran-produk/queries";
import { DownloadIcon } from "lucide-react";

interface DetailPageProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPageProps) => {
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<ColumnProductionTypeDefProps | null>(null);
  const [size, setSize] = useState<Size | null>(null);



const handleDownload = async (imageUrl: string, fileName: string) => {
  if (!imageUrl) return;

  const res = await fetch(imageUrl);
  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getProductionById(id);
        setData(data ?? null);
        const { data: sizes } = await getDataByName(
          data?.orderItem.products.size ?? ""
        );
        if (sizes) setSize(sizes);
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
            Yang Mengerjakan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.assignedTo?.email ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Progress
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{`${data.progress} %`}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Tanggal Mulai
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{format(data.startDate ?? "", "PPP")}</p>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Tanggal Selesai
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{format(data.endDate ?? "", "PPP")}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Status
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>
              <Button variant={"default"} size={"sm"}>
                {data.status}
              </Button>
            </p>
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

        {/*  */}
        <div className="flex flex-col  gap-2 items-center text-sm my-3 sm:my-5">
          <div className="w-full">
            <Image
              src={data.orderItem.order.designs[0].fileUrl ?? ""}
              alt={data.orderItem.products.fileName ?? ""}
              width={100}
              height={100}
              className="w-full h-full rounded-md"
            />
            <Button type="button" onClick={() => handleDownload(data.orderItem.order.designs[0].fileUrl ?? "", data.orderItem.order.designs[0].filename ?? "")} variant={"default"} size={"sm"}>
              <DownloadIcon /> Download
            </Button>
          </div>
          <div className="w-full flex flex-col gap-1 ">
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Produk
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.orderItem.products.name ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Tipe Sablon
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{`${data.sablonType?.name} `}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Warna
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.orderItem.products.color ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Ukuran
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.orderItem.products.size ?? "-"}</p>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Area Cetak
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.orderItem.printAreas}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Color Count
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.orderItem.colorCount}</p>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Lebar Dada (cm)
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{size?.chest ?? "-"} cm</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Panjang Lengan (cm)
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{size?.sleeve ?? "-"} cm</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Panjang Badan (cm)
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{size?.length ?? "-"} cm</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
