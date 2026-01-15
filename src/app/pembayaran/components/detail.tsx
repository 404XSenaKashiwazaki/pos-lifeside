"use client";

import { IconUserCircle } from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Customer, Order } from "@prisma/client";
import { getPaymentById } from "../queries";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DetailPageProps {
  id: string | null;
}

const DetailPage: React.FC<DetailPageProps> = ({ id }) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ColumnPaymentTypeDefProps | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getPaymentById(id);
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
            <p>{data.order.customer.name ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            No Hp
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.order.customer.phone ?? "-"}</p>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Email
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.order.customer.email ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Alamat
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.order.customer.address ?? "-"}</p>
          </span>
        </div>

        <div className="w-full mt-3 sm:mt-5 ">
          <Image
            src={data.reference ?? ""}
            alt={data.filename}
            width={500}
            height={500}
            priority
            className="w-full h-full rounded-md"
          />
        </div>
        {/*  */}
        <div className="space-y-0.5 mt-3 sm:mt-5">
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Nomor Order
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>
                <Button size={"sm"} variant={"default"}>
                  {data.order.orderNumber}
                </Button>
              </p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Status
            </span>

            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>
                <Button
                  // variant={"destructive"}
                  size={"sm"}
                  variant={`${
                    data.status !== "FAILED" ? "default" : "destructive"
                  }`}
                >
                  {data.status}
                </Button>
              </p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Total Tagihan
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.order.totalAmount)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Total Pembayaran
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.amount)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Kembalian
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.amountReturn ?? 0)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Tipe Pembayaran
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.type}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Metode Pembayaran
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p className="capitalize">
                {data.method.name} -{" "}
                <span className="bg-slate-200 px-2 py-1">{data.method.no}</span>
              </p>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Tanggal Pembayaran
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{format(data.paidAt ?? "", "PPP")}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Catatan
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.notes}</p>
            </span>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default DetailPage;
