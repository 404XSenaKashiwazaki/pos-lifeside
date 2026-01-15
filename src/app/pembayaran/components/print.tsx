"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatCurrency";
import { Payment } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { getPaymentById } from "../queries";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
import {
  IconFile,
  IconFileExport,
  IconPhone,
  IconPrinter,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { useReactToPrint } from "react-to-print";

interface PaymentsPrintProps {
  id: string;
  siteName: string | null;
  siteFileUrl: string | null;
  siteAddress: string | null;
  sitePhone: string | null;
  siteEmail: string | null;
}
const PaymentsPrint: React.FC<PaymentsPrintProps> = ({
  id,
  siteAddress,
  siteEmail,
  siteFileUrl,
  siteName,
  sitePhone,
}) => {
  const [inv, setInv] = useState<string>("INVOICE");
  const contentRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ColumnPaymentTypeDefProps | null>(null);
  const date = new Date();
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
      if (id) {
        const { data } = await getPaymentById(id);
        setData(data ?? null);
      }
    });
  }, []);

  // const produk = pembelian?.detailpembelian.map(e=> ({...data.}))
  if (isPending) return <Skeleton className="w-full h-52" />;
  if (!data) return <div>Tidak Ada Data.</div>;

  return (
    <div>
      <div className="space-y-1 mt-1 p-5" key={data.id} ref={contentRef}>
        <div className="flex gap-1 mb-1 text-2xl justify-center font-medium">
          {inv + "-" + datePrint}
        </div>
        <div className="flex gap-1 mb-1 text-md font-medium">
          <IconPhone className="h-5 w-5" />
          Info Kontak
        </div>
        <div className="flex flex-row items-start gap-1 w-full">
          <img
            src={siteFileUrl ?? ""}
            alt={siteName ?? "image"}
            width={100}
            height={100}
            className="w-10 h-10 rounded-sm"
          />
          <div className="flex-4 w-full ">
            <div className="flex gap-1 text-md font-medium">
              {siteName ?? "-"}
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>{siteEmail ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>{sitePhone ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm ">
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>{siteAddress ?? "-"}</p>
              </span>
            </div>
          </div>
        </div>
        <Separator className="mt-1" />
        <div className="space-y-1">
          <div className="flex flex-col  sm:flex-row gap-2 items-start text-sm">
            <div className="flex flex-col gap-1 w-auto">
              <div className="mb-1 text-md font-medium">Pembeli</div>
              <div className="flex flex-row gap-1  justify-between items-start text-sm">
                <span className="flex items-center gap-1 text-muted-foreground  w-full">
                  <p>{data.order.customer.name ?? "-"}</p>
                </span>
              </div>
              <div className="flex flex-row gap-1  justify-between items-start text-sm">
                <span className="flex items-center gap-1 text-muted-foreground  w-full">
                  <p>{data.order.customer.phone ?? "-"}</p>
                </span>
              </div>
              <div className="flex flex-row gap-1  justify-between items-start text-sm">
                <span className="flex items-center gap-1 text-muted-foreground  w-full">
                  <p>{data.order.customer.email ?? "-"}</p>
                </span>
              </div>
              <div className="flex flex-row gap-1  justify-between items-start text-sm">
                <span className="flex items-center gap-1 text-muted-foreground  w-full">
                  <p>{data.order.customer.address ?? "-"}</p>
                </span>
              </div>
            </div>
            <div className="mb-1 mt-1 mx-3 ">
              <div className="mb-1 text-md font-medium">Produk</div>
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between text-sm my-1">
                <img
                  src={data.order.designs[0].fileUrl ?? ""}
                  alt="sfasg"
                  width={100}
                  height={100}
                  className="w-20 h-20 rounded-md"
                />
                <div className="w-full flex flex-col gap-1 ">
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Produk
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{data.order.items[0].products.name ?? "-"}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Tipe Sablon-Harga Dasar
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>
                        {`${
                          data.order.items[0]?.production?.sablonType
                            ? data.order.items[0]?.production?.sablonType.name
                            : ""
                        } `}{" "}
                        -
                        {` ${
                          data.order.items[0]?.production?.sablonType
                            ? formatCurrency(
                                data.order.items[0]?.production?.sablonType
                                  .basePrice ?? 0
                              )
                            : ""
                        }`}
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Warna
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{data.order.items[0].products.color ?? "-"}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Ukuran
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{data.order.items[0].products.size ?? "-"}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Jumlah/Qty
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>{data.order.items[0].quantity ?? "-"}</p>
                    </span>
                  </div>
                  <div className="flex flex-row gap-1  justify-between items-start text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground  w-full">
                      Harga
                    </span>
                    <span className="font-xs text-primary  w-full  flex items-start gap-1">
                      <p>:</p>
                      <p>
                        {formatCurrency(data.order.items[0].unitPrice ?? 0)}
                      </p>
                    </span>
                  </div>
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
                    {data.order.orderNumber}
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
                      data.status !== "FAILED" ? "default" : "destructive"
                    }`}
                  >
                    {data.status}
                  </Button>
                </p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Total
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                {/* <p> {formatCurrency(data.order.items[0].subtotal ?? 0)}</p>
                 */}
                <p> {formatCurrency(data.order.totalAmount ?? 0)}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Biaya Pegiriman
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{formatCurrency(data.order.shippingFee ?? 0)}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Diskon
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{formatCurrency(data.order.discountAmount ?? 0)}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Kembalian
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{formatCurrency(data.amountReturn ?? 0)}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Total Pembayaran
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{formatCurrency(data.amount ?? 0)}</p>
              </span>
            </div>

            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Tipe Pembayaran
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.type}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Metode Pembayaran
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p className="capitalize">{data.method.name}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Tanggal Pembayaran
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{format(data.paidAt ?? "", "PPP")}</p>
              </span>
            </div>
            <div className="flex flex-row gap-1  justify-between items-start text-sm">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Catatan
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.notes}</p>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 items-start sm:justify-between text-sm mt-2 sm:mt-4">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Bukti Transfer
              </span>
              <span className="font-xs text-primary  w-full h-full  flex items-start gap-1">
                <p>:</p>
                <img
                  src={data.reference ?? ""}
                  alt={data.filename ?? ""}
                  width={500}
                  height={500}
                  className="w-full h-full rounded-md"
                />
              </span>
            </div>
            <div className="rounded-sm shadow-md border-0 px-5 py-1 space-y-1 bg-white">
              <p className="text-md font-bold flex items-center gap-2">
                Terima kasih telah melakukan pemesanan!
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Detail pesanan Anda sudah kami terima dan sedang diproses oleh
                tim produksi dengan kualitas terbaik. Kami akan menginformasikan
                kembali apabila pesanan telah selesai atau membutuhkan
                konfirmasi lebih lanjut.
              </p>

              <p className="pt-1 font-semibold text-md">
                Hormat kami, <span className="text-primary">{siteName}</span>
              </p>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
      <div className="flex gap-1 justify-end mb-5 text-m font-semibold mt-5 mx-5">
        <Button size={"sm"} variant={"default"} onClick={reactToPrintFn}>
          <IconFileExport className="h-5 w-5" />
          PDF
        </Button>
      </div>
    </div>
  );
};

export default PaymentsPrint;
