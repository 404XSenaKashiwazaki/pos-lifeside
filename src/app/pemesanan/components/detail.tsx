"use client";
import {
  IconAddressBook,
  IconMail,
  IconPencil,
  IconPhone,
} from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Customer, Order, Prisma } from "@prisma/client";
import { getOrderById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DetailPembelianProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Prisma.OrderGetPayload<{
    include: {
      customer: true;
      payments: true;
      items: {
        include: {
          products: true;
          production: {
            include: { sablonType: true };
          };
        };
      };
      designs: true;
    };
  }> | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getOrderById(id);
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
            <p>{data.customer.name ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            No Hp
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.customer.phone ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Email
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.customer.email ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Alamat
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.customer.address ?? "-"}</p>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between text-sm my-2 sm:my-4">
          <div className="w-full">
            <Image
              src={data.items[0].products.fileUrl ?? ""}
              alt="sfasg"
              width={500}
              height={500}
              className=""
            />
          </div>
          <div className="w-full flex flex-col gap-1 ">
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Produk
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.items[0].products.name ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Tipe Sablon
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>
                  {`${data.items[0].production?.sablonType?.name} `} -{" "}
                  {`${formatCurrency(
                    data.items[0].production?.sablonType?.basePrice ?? 0
                  )} `}
                </p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Warna
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.items[0].products.color ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Ukuran
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.items[0].products.size ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Harga
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>
                  {formatCurrency(data.items[0].products.sellingPrice ?? 0)}
                </p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Stok
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.items[0].products.stok ?? "-"}</p>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Nomor Order
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>
                <Button size={"sm"} variant={"default"}>
                  {data.orderNumber}
                </Button>
              </p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Status Pesanan
            </span>

            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>
                <Button
                  // variant={"destructive"}
                  size={"sm"}
                  variant={`${
                    data.status !== "CANCELLED" ? "default" : "destructive"
                  }`}
                >
                  {data.status}
                </Button>
              </p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Sub Total Pemesanan-Pengiriman-diskon
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.totalAmount)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Biaya Pengiriman
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.shippingFee ?? 0)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Diskon
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.discountAmount ?? 0)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Jumlah
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.items[0].quantity}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Area Cetak
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.items[0].printAreas}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Color Count
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{data.items[0].colorCount}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Unit Price
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.items[0].unitPrice)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Cost Price
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.items[0].costPrice ?? 0)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Cost Total
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.items[0].costTotal ?? 0)}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Sub Total
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{formatCurrency(data.items[0].subtotal ?? 0)}</p>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Tanggal Pemesanan
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{format(data.createdAt, "PPP")}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Tanggal Selesai/Deadline
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{format(data.productionDue ?? "", "PPP")}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Progress Produksi
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <p>{`${data.items[0].production?.progress} %`}</p>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
            <span className="flex items-center gap-1 text-muted-foreground  w-full">
              Status Produksi
            </span>
            <span className="font-xs text-primary  w-full  flex items-start gap-1">
              <p>:</p>
              <Button
                // variant={"destructive"}
                size={"sm"}
                variant={`${
                  data.items[0].production?.status !== "CANCELED"
                    ? "default"
                    : "destructive"
                }`}
              >
                {data.items[0].production?.status}
              </Button>
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
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
