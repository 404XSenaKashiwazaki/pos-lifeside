"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatCurrency";
import { Payment } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { byPayments } from "../queries";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
import {
  IconArrowLeft,
  IconFile,
  IconFileExport,
  IconPhone,
  IconPrinter,
} from "@tabler/icons-react";
import { useSite } from "@/components/providers/Site-provider";
import { Separator } from "@/components/ui/separator";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import Link from "next/link";

interface PaymentsPrintProps {
  id: string[];
  status: string;
}
const PaymentsPrint: React.FC<PaymentsPrintProps> = ({ id, status }) => {
  const sites = useSite();
  const [isPending, startTransition] = useTransition();
  const date = new Date();
  const [inv, setInv] = useState<string>("INVOICE");
  const [data, setData] = useState<ColumnPaymentTypeDefProps[] | null[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const datePrint =
    date.getFullYear() +
    "" +
    date.getDate() +
    "" +
    date.getMonth() +
    "" +
    date.getHours() +
    "" +
    date.getMinutes() +
    "" +
    date.getMilliseconds();
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: inv + "-" + datePrint,
  });

  useEffect(() => {
    startTransition(async () => {
      if (id.length > 0) {
        const { data } = await byPayments({
          id,
          status,
        });
        if (data) {
          setData(data);
        }
      }
    });
  }, []);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e?.}))
  if (isPending || !sites) return <Skeleton className="w-full h-52" />;
  if (!data || data.length === 0) return <div>Tidak Ada Data.</div>;

  return (
    <div>
      <div className="flex gap-2 items-start sm:justify-between">
        <div className="flex gap-1 mb-5 text-m font-semibold">
          <IconPrinter className="h-5 w-5" />
          Cetak Laporan
        </div>

        <div className="flex gap-2 flex-col sm:flex-row sm:justify-between">
          <Link href={"/laporan"} className="flex gap-1">
            <Button size={"sm"} variant={"outline"}>
              <IconArrowLeft className="h-5 w-5" /> Kembali
            </Button>
          </Link>
          <div className="flex gap-1 mb-5 text-m font-semibold">
            <Button size={"sm"} variant={"default"} onClick={reactToPrintFn}>
              <IconFileExport className="h-5 w-5" />
              PDF
            </Button>
          </div>
        </div>
      </div>
      <div ref={contentRef} className="px-5 py-2 mt-2">
        <div className="flex gap-1 mb-1 text-2xl justify-center font-medium">
          {inv}
        </div>
        {data.length > 0 ? (
          data.map((e, i) => (
            <div className="space-y-1 mt-1" key={e?.id}>
              <div className="flex gap-1 mb-1 text-md font-medium">
                <IconPhone className="h-5 w-5" />
                Info Kontak
              </div>
              <div className="flex flex-row items-start gap-1 w-full">
                <img
                  src={sites.fileProofUrl ?? ""}
                  alt={sites.filename ?? "image"}
                  width={100}
                  height={100}
                  className="w-10 h-10 rounded-sm"
                />
                <div className="flex-4 w-full ">
                  <div className="flex gap-1 text-md font-medium">
                    {sites.name ?? "-"}
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>{sites.email ?? "-"}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>{sites?.phone ?? "-"}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm ">
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>{sites.address ?? "-"}</p>
                    </span>
                  </div>
                </div>
              </div>
              <Separator className="mt-1" />
              <div className="space-y-1">
                <div className="mb-1 text-md font-medium">Pembeli</div>
                <div className="flex flex-row gap-1  justify-between items-start text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground  w-full">
                    Nama
                  </span>
                  <span className="font-xs text-primary  w-full  flex items-start gap-1">
                    <p>:</p>
                    <p>{e?.order.customer.name ?? "-"}</p>
                  </span>
                </div>
                <div className="flex flex-row gap-1  justify-between items-start text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground  w-full">
                    No Hp
                  </span>
                  <span className="font-xs text-primary  w-full  flex items-start gap-1">
                    <p>:</p>
                    <p>{e?.order.customer.phone ?? "-"}</p>
                  </span>
                </div>

                <div className="flex flex-row gap-1  justify-between items-start text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground  w-full">
                    Email
                  </span>
                  <span className="font-xs text-primary  w-full  flex items-start gap-1">
                    <p>:</p>
                    <p>{e?.order.customer.email ?? "-"}</p>
                  </span>
                </div>
                <div className="flex flex-row gap-1  justify-between items-start text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground  w-full">
                    Alamat
                  </span>
                  <span className="font-xs text-primary  w-full  flex items-start gap-1">
                    <p>:</p>
                    <p>{e?.order.customer.address ?? "-"}</p>
                  </span>
                </div>
                <Separator className="mt-1" />
                <div className="mb-1 mt-1">
                  <div className="mb-1 text-md font-medium">Produk</div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start justify-between text-sm my-1">
                    <div className="w-full">
                      <img
                        src={e?.order.items[0].products.fileUrl ?? ""}
                        alt="sfasg"
                        width={500}
                        height={500}
                        className="w-30 h-30 rounded-md"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-1 ">
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Produk
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.order.items[0].products.name ?? "-"}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Tipe Sablon-Harga Dasar
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {`${e?.order.items[0].production?.sablonType?.name} `}{" "}
                            -{" "}
                            {formatCurrency(
                              e?.order.items[0].production?.sablonType
                                ?.basePrice ?? 0
                            )}
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Warna
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.order.items[0].products.color ?? "-"}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Ukuran
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.order.items[0].products.size ?? "-"}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Biaya Pembelian
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {formatCurrency(
                              e?.order.items[0].products.purchaseCost ?? 0
                            )}
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Harga Penjualan
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {formatCurrency(
                              e?.order.items[0].products.sellingPrice ?? 0
                            )}
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Jumlah/Qty
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.order.items[0].quantity ?? "-"}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Harga Satuan
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {formatCurrency(e?.order.items[0].unitPrice ?? 0)}
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Harga Biaya
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {formatCurrency(e?.order.items[0].costPrice ?? 0)}
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Jumlah Biaya <span className="text-xs">Sablon</span>
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {formatCurrency(e?.order.items[0].costTotal ?? 0)}
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Jumlah Total
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {" "}
                            {formatCurrency(e?.order.items[0].subtotal ?? 0)}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="mt-1" />
                <div className="mb-1 text-md font-medium mt-1">Transaksi</div>
                {/*  */}
                <div className="space-y-1 mt-1">
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Nomor Order
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>
                        <Button size={"sm"} variant={"default"}>
                          {e?.order.orderNumber}
                        </Button>
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
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
                            e?.status !== "FAILED" ? "default" : "destructive"
                          }`}
                        >
                          {e?.status}
                        </Button>
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Biaya Pegiriman
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{formatCurrency(e?.order.shippingFee ?? 0)}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Diskon
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{formatCurrency(e?.order.discountAmount ?? 0)}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Total Pembayaran
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{formatCurrency(e?.amount ?? 0)}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Kembalian
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{formatCurrency(e?.amountReturn ?? 0)}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Tipe Pembayaran
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{e?.type}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Metode Pembayaran
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p className="capitalize">{e?.method?.name}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Tanggal Pembayaran
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{format(e?.paidAt ?? "", "PPP")}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Catatan
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{e?.notes}</p>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-1 items-start sm:justify-between text-sm mt-1">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Bukti Transfer
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <img
                        src={e?.reference ?? ""}
                        alt={e?.filename ?? ""}
                        width={500}
                        height={500}
                        className="w-full h-full rounded-md"
                      />
                    </span>
                  </div>
                </div>
                {/*  */}
              </div>
            </div>
          ))
        ) : (
          <div>Tidak Ada Data</div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPrint;
