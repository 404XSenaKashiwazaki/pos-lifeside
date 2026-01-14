"use client";

import { useSite } from "@/components/providers/Site-provider";
import { PrintOrders } from "@/types/datatable";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { byOrders } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconArrowLeft,
  IconFileExport,
  IconPhone,
  IconPrinter,
} from "@tabler/icons-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";

interface OrdersPrintProps {
  id: string[];
  status: string;
}
const OrdersPrint: React.FC<OrdersPrintProps> = ({ id, status }) => {
  const sites = useSite();
  const date = new Date();
  const [inv, setInv] = useState<string>("INVOICE");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<PrintOrders[] | null[]>([]);
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
        const { data } = await byOrders({
          id,
          status,
        });
        if (data) setData(data);
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
            <Button size={"sm"} variant={"outline"} >
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
          data.map((e) => (
            <div className="rounded-sm border-0 mt-1" key={e?.id}>
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
                <div className="space-y-1">
                  <div className="mb-1 mt-1">
                    <div className="mb-1 text-md font-medium">Pembeli</div>
                    <div className="flex flex-row gap-1  justify-between items-start text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground  w-full">
                        Nama
                      </span>
                      <span className="font-xs text-primary  w-full  flex items-start gap-1">
                        <p>:</p>
                        <p>{e?.customer.name ?? "-"}</p>
                      </span>
                    </div>
                    <div className="flex flex-row gap-1  justify-between items-start text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground  w-full">
                        No Hp
                      </span>
                      <span className="font-xs text-primary  w-full  flex items-start gap-1">
                        <p>:</p>
                        <p>{e?.customer.phone ?? "-"}</p>
                      </span>
                    </div>
                    <div className="flex flex-row gap-1  justify-between items-start text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground  w-full">
                        Email
                      </span>
                      <span className="font-xs text-primary  w-full  flex items-start gap-1">
                        <p>:</p>
                        <p>{e?.customer.email ?? "-"}</p>
                      </span>
                    </div>
                    <div className="flex flex-row gap-1  justify-between items-start text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground  w-full">
                        Alamat
                      </span>
                      <span className="font-xs text-primary  w-full  flex items-start gap-1">
                        <p>:</p>
                        <p>{e?.customer.address ?? "-"}</p>
                      </span>
                    </div>
                  </div>
                  <Separator className="mt-1" />
                  <div className="mb-1 mt-1">
                    <div className="mb-1 text-md font-medium">Produk</div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start justify-between text-sm my-1">
                      <div className="w-full">
                        <img
                          src={e?.designs[0].fileUrl ?? ""}
                          alt="sfasg"
                          width={100}
                          height={100}
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
                            <p>{e?.items[0].products.name ?? "-"}</p>
                          </span>
                        </div>
                        <div className="flex flex-row gap-1  justify-between items-start text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground  w-full">
                            Tipe Sablon
                          </span>
                          <span className="font-xs text-primary  w-full  flex items-start gap-1">
                            <p>:</p>
                            <p>{`${e?.items[0].production?.sablonType?.name} `} - {`${formatCurrency(e?.items[0].production?.sablonType?.basePrice ?? 0)} `}</p>
                          </span>
                        </div>
                        <div className="flex flex-row gap-1  justify-between items-start text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground  w-full">
                            Warna
                          </span>
                          <span className="font-xs text-primary  w-full  flex items-start gap-1">
                            <p>:</p>
                            <p>{e?.items[0].products.color ?? "-"}</p>
                          </span>
                        </div>
                        <div className="flex flex-row gap-1  justify-between items-start text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground  w-full">
                            Ukuran
                          </span>
                          <span className="font-xs text-primary  w-full  flex items-start gap-1">
                            <p>:</p>
                            <p>{e?.items[0].products.size ?? "-"}</p>
                          </span>
                        </div>
                        <div className="flex flex-row gap-1  justify-between items-start text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground  w-full">
                            Harga
                          </span>
                          <span className="font-xs text-primary  w-full  flex items-start gap-1">
                            <p>:</p>
                            <p>
                              {formatCurrency(
                                e?.items[0].products.sellingPrice ?? 0
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
                            <p>{e?.items[0].quantity}</p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-1" />
                  <div className="mb-1 mt-1">
                    <div className="mb-1 text-md font-medium">Transaksi</div>
                    <div className="space-y-0.5">
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Nomor Order
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            <Button size={"sm"} variant={"default"}>
                              {e?.orderNumber}
                            </Button>
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
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
                                e?.status !== "CANCELLED"
                                  ? "default"
                                  : "destructive"
                              }`}
                            >
                              {e?.status}
                            </Button>
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Status Pembayaran
                        </span>

                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>
                            {(!(e as any)?.payments || (e as any).payments.length === 0) ? (
                              <Button size={"sm"} variant={"destructive"}>
                                Belum Bayar
                              </Button>
                            ) : (
                              <Button
                                // variant={"destructive"}
                                size={"sm"}
                                variant={`${
 (e as any).payments[0].status !== "FAILED"
                                    ? "default"
                                    : "destructive"
                                }`}
                              >
                                { (e as any).payments[0].status}
                              </Button>
                            )}
                          </p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Metode Pembayaran
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <div>
                            {e?.paymentMethod !== "cash" ? (
                              <>
                                <Card className=" px-4 py-0.5 rounded-sm text-lg font-medium capitalize">
                                  {e?.paymentMethod} - {e?.noPayment}
                                </Card>
                              </>
                            ) : (
                              <>
                                <Card className=" px-4 py-0.5 rounded-sm text-lg font-medium capitalize">
                                  {e?.paymentMethod}
                                </Card>
                              </>
                            )}
                          </div>
                        </span>
                      </div>

                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Area Cetak
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.items[0].printAreas}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Color Count
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.items[0].colorCount}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Unit Price
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{formatCurrency(e?.items[0].unitPrice ?? 0)}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Cost Price
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{formatCurrency(e?.items[0].costPrice ?? 0)}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Cost Total
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{formatCurrency(e?.items[0].costTotal ?? 0)}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Jumlah
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.items[0].quantity}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Total
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{formatCurrency(e?.items[0].subtotal ?? 0)}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Biaya Pengiriman
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{formatCurrency(e?.shippingFee ?? 0)}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Diskon
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{formatCurrency(e?.discountAmount ?? 0)}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Sub Total Sub Total + (
                          <span className="text-xs font-extralight">
                            Produksi+Pengiriman-Diskon
                          </span>
                          )
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{formatCurrency(e?.totalAmount ?? 0)}</p>
                        </span>
                      </div>

                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Tanggal Pemesanan
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{format(e?.createdAt ?? "", "PPP")}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Tanggal Selesai/Deadline
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{format(e?.productionDue ?? "", "PPP")}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Progress Produksi
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{`${e?.items[0].production?.progress} %`}</p>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Status Produksi
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <Button
                            // variant={"destructive"}
                            size={"sm"}
                            variant={`${
                              e?.items[0].production?.status !== "CANCELED"
                                ? "default"
                                : "destructive"
                            }`}
                          >
                            {e?.items[0].production?.status}
                          </Button>
                        </span>
                      </div>
                      <div className="flex flex-row gap-1  justify-between items-start text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground  w-full">
                          Catatan
                        </span>
                        <span className="font-xs text-primary  w-full  flex items-start gap-1">
                          <p>:</p>
                          <p>{e?.notes ?? "-"}</p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="rounded-xl border p-5 space-y-3 bg-white shadow-sm">
              <p className="text-xl font-bold flex items-center gap-2">
                🎉 Terima kasih telah melakukan pemesanan!
              </p>

              <p className="text-base text-muted-foreground leading-relaxed">
                Detail pesanan Anda sudah kami terima dan sedang diproses oleh
                tim produksi dengan kualitas terbaik. Kami akan menginformasikan
                kembali apabila pesanan telah selesai atau membutuhkan
                konfirmasi lebih lanjut.
              </p>

              <p className="pt-2 font-semibold text-lg">
                Hormat kami, <span className="text-primary">{sites.name}</span>
              </p>
            </div> */}
            </div>
          ))
        ) : (
          <div>Tidak Valid.</div>
        )}
      </div>
    </div>
  );
};

export default OrdersPrint;
