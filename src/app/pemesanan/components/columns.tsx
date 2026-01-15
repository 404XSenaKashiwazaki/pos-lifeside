"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit2Icon, SearchCheck, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnOrderTypeDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailPage from "./detail";
import {
  Customer,
  PaymentMethods,
  Product,
  SablonType,
  User,
} from "@prisma/client";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { useSheet } from "@/components/providers/Sheet-provider";
import {
  IconAlertCircle,
  IconInfoCircle,
  IconPrinter,
  IconShoppingCartPlus,
} from "@tabler/icons-react";
import DeleteModal from "./delete";
import OrdersPrint from "./print";
import { useSite } from "@/components/providers/Site-provider";
import Image from "next/image";

interface CellActionProps {
  row: Row<ColumnOrderTypeDefProps>;
  customer: Customer[];
  handle: User[];
  sablon: SablonType[];
  products: Product[];
  payments: PaymentMethods[];
}
const CellAction = ({
  row,
  customer,
  handle,
  sablon,
  products,
  payments,
}: CellActionProps) => {
  const { modal, setOpen } = useModal();
  const { sheet } = useSheet();
  const sites = useSite();
  const showModalDelete = () => {
    modal({
      title: (
        <div className="flex gap-1">
          <IconAlertCircle className="h-5 w-5" />
          Apakah Kamu Benar-benar Yakin?
        </div>
      ),
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus pemesanan Anda secara permanen",
      body: <DeleteModal id={row.original.id} setOpen={setOpen} />,
    });
  };

  const showModalEdit = () => {
    sheet({
      title: (
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconShoppingCartPlus className="h-4 w-4" />
          Form edit data pemesanan
        </span>
      ),
      description: "form untuk edit data pemesanan ",
      content: (
        <FormPage
          noPayment={Number(row.original.noPayment)}
          stokInDb={row.original.items[0].products.stok}
          paymentMethod={row.original.paymentMethod ?? ""}
          products={products}
          payments={payments}
          colorCount={row.original.items[0].colorCount ?? 0}
          handleById={row.original.handledById ?? ""}
          printAreas={row.original.items[0].printAreas ?? ""}
          printArea={row.original.items[0].printArea ?? 0}
          sablonTypeId={row.original.items[0].production?.sablonTypeId ?? ""}
          sablon={sablon}
          handle={handle}
          customer={customer}
          id={row.original.id}
          orderNumber={row.original.orderNumber}
          productionDue={row.original.productionDue ?? ""}
          createdAt={row.original.createdAt ?? ""}
          address={row.original.customer.address ?? ""}
          phone={row.original.customer.phone ?? ""}
          name={row.original.customer.name ?? ""}
          color={row.original.items[0].color ?? ""}
          customerId={row.original.customerId}
          email={row.original.customer.email ?? ""}
          filename={row.original.designs[0].filename}
          notes={row.original.notes ?? ""}
          previewUrl={row.original.designs[0].previewUrl ?? ""}
          quantity={row.original.items[0].quantity ?? 1}
          size={row.original.items[0].size ?? ""}
          status={row.original.status}
          totalAmount={row.original.items[0].subtotal}
          unitPrice={row.original.items[0].unitPrice}
          product={row.original.items[0].product}
          shippingFee={row.original.shippingFee ?? 0}
          discountAmount={row.original.discountAmount ?? 0}
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
          Detail Data Pemesanan
        </div>
      ),
      body: <DetailPage id={row.original.id} />,
      description: "Detail data pemesanan ",
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
        <OrdersPrint
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
  customer,
  handle,
  sablon,
  products,
  payments,
}: {
  customer: Customer[];
  handle: User[];
  sablon: SablonType[];
  products: Product[];
  payments: PaymentMethods[];
}): ColumnDef<ColumnOrderTypeDefProps>[] => [
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
    accessorFn: (row: ColumnOrderTypeDefProps) => row.customer.name ?? "",
    header: () => <div>Nama pemesan</div>,
    cell: (info) => info.getValue(),
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },

  {
    accessorKey: "product",
    enableGlobalFilter: true,
    accessorFn: (row: ColumnOrderTypeDefProps) =>
      row.items[0].products.name ?? "",
    cell: ({ row }) => {
      const product = row.original.items[0].products.name;
      const imageUrl = row.original.designs[0].fileUrl;
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
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal pesan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="">{format(row.getValue("createdAt"), "PPP")}</div>;
    },
  },
  {
    accessorKey: "productionDue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal selesai
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{format(row.getValue("productionDue"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "subtotal",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{formatCurrency(row.original.items[0].subtotal)}</div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sub Total
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{formatCurrency(row.getValue("totalAmount"))}</div>
    ),
  },

  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => (
      <CellAction
        row={row}
        products={products}
        customer={customer}
        sablon={sablon}
        handle={handle}
        payments={payments}
      />
    ),
  },
];
