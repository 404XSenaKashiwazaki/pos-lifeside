"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit2Icon,
  SearchCheck,
  Trash2Icon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailPage from "./detail";
import { PaymentMethods, Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  IconAlertCircle,
  IconCreditCardPay,
  IconInfoCircle,
  IconPrinter,
} from "@tabler/icons-react";
import { useSheet } from "@/components/providers/Sheet-provider";
import DeleteModal from "./delete";
import PaymentsPrint from "./print";
import { useSite } from "@/components/providers/Site-provider";
import Image from "next/image";

interface CellActionProps {
  payments: PaymentMethods[];
  row: Row<ColumnPaymentTypeDefProps>;
  orders: Prisma.OrderGetPayload<{
    include: {
      customer: true;
      designs: true;
      items: {
        include: {
          products: true;
        };
      };
      payments: true;
    };
  }>[];
}

const CellAction = ({ row, orders, payments }: CellActionProps) => {
  const sites = useSite();
  const { modal, setOpen } = useModal();
  const { sheet } = useSheet();

  const showModalDelete = () => {
    modal({
      title: (
        <div className="flex gap-1">
          <IconAlertCircle className="h-5 w-5" />
          Apakah Kamu Benar-benar Yakin?
        </div>
      ),
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data Anda secara permanen",
      body: <DeleteModal id={row.original.id} setOpen={setOpen} />,
    });
  };

  const showModalEdit = () => {
    sheet({
      title: (
        <span className="flex  gap-1 ">
          <IconCreditCardPay className="h-5 w-5" />
          Form edit data pembayaran
        </span>
      ),
      description: "form untuk edit data pembayaran ",
      content: (
        <FormPage
          payments={payments}
          id={row.original.id}
          amountReturn={row.original.amountReturn ?? 0}
          amount={row.original.amount}
          method={row.original.methodId}
          orderAmount={row.original.order.totalAmount}
          orderId={row.original.orderId}
          paidAt={row.original.paidAt ?? ""}
          reference={row.original.reference ?? ""}
          status={row.original.status ?? ""}
          type={row.original.type}
          orders={orders}
          notes={row.original.notes ?? ""}
          product={row.original.order.items[0].product}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: (
        <div className="flex gap-1">
          <IconInfoCircle className="h-5 w-5" />
          Detail Data Pembayaran
        </div>
      ),
      body: <DetailPage id={row.original.id} />,
      description: "Detail data pembayaran",
      size: "sm:max-w-2xl",
    });
  };

  const showModalPrint = () => {
    modal({
      title: (
        <div className="flex gap-1">
          <IconPrinter className="h-5 w-5" />
          Cetak Invoice Pemesanan
        </div>
      ),
      body: (
        <PaymentsPrint
          id={row.original.id}
          siteName={sites?.name ?? ""}
          siteFileUrl={sites?.fileProofUrl ?? ""}
          siteAddress={sites?.address ?? ""}
          siteEmail={sites?.email ?? ""}
          sitePhone={sites?.phone ?? ""}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };
  return (
    <div className="flex gap-1 flex-col md:flex-row w">
      <Button
        variant="ghost"
        size={"sm"}
        className="bg-green-700 hover:bg-green-600 text-white hover:text-slate-50"
        onClick={() => showModalPrint()}
      >
        <IconPrinter />
        Cetak
      </Button>
      <Button variant="outline" size={"sm"} onClick={() => showModalDetail()}>
        <SearchCheck />
        Detail
      </Button>
      <Button variant="default" size={"sm"} onClick={() => showModalEdit()}>
        <Edit2Icon />
        Edit
      </Button>
      <Button
        variant="destructive"
        size={"sm"}
        onClick={() => showModalDelete()}
      >
        <Trash2Icon />
        Hapus
      </Button>
    </div>
  );
};

export const columns = ({
  orders,
  payments,
}: Pick<CellActionProps, "orders"> & {
  payments: PaymentMethods[];
}): ColumnDef<ColumnPaymentTypeDefProps>[] => [
  {
    id: "select",
    header: () => <div>No</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    id: "name",
    accessorFn: (row: ColumnPaymentTypeDefProps) =>
      row.order.customer.name ?? "",
    header: () => <div>Nama pemesan</div>,
    cell: (info) => info.getValue(),
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "product",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produk/barang
          <ArrowUpDown />
        </Button>
      );
    },
    // cell: ({ row }) => (
    //   <div className="capitalize">{row.original.order.items[0].products.name}</div>
    // ),
     cell: ({ row }) => {
          const product = row.original.order.items[0].products.name
          const imageUrl = row.original.order.designs[0].fileUrl
          return (
            <div className="flex items-center gap-3 max-w-[200px]">
              <Image
                src={imageUrl ?? ""}
                className="w-10  h-10"
                width={100}
                height={100}
                priority
                alt={product}
              />
              <span className="font-normal break-words whitespace-normal leading-snug">{product ?? "-"}</span>
            </div>
          );
        },
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal dibayar
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{format(row.getValue("paidAt"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div>Type </div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant={"default"}>{row.original.type}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant={"default"}>{row.original.status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tagihan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{formatCurrency(row.original.order.totalAmount ?? 0)}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total bayar
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{formatCurrency(row.getValue("amount"))}</div>
    ),
  },
  {
    accessorKey: "amountReturn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kembalian 
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{formatCurrency(row.original.amountReturn ?? 0)}</div>
    ),
  },

  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => (
      <CellAction row={row} orders={orders} payments={payments} />
    ),
  },
];
