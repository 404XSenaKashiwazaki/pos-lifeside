"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit2Icon, SearchCheck, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnProductsDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailCustomer from "./detail";
import DeleteModal from "./delete";
import {
  IconAlertCircle,
  IconInfoCircle,
  IconPencil,
} from "@tabler/icons-react";
import { Size } from "@prisma/client";
import Image from "next/image";

const CellAction = ({
  row,
  sizes,
}: {
  row: Row<ColumnProductsDefProps>;
  sizes: Size[];
}) => {
  const { modal, setOpen } = useModal();

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
    modal({
      title: (
        <div className="flex gap-1">
          <IconPencil className="h-5 w-5" /> Edit Data Produk
        </div>
      ),
      body: (
        <FormPage
          sizes={sizes}
          name={row.original.name}
          purchaseCost={row.original.purchaseCost}
          sellingPrice={row.original.sellingPrice}
          size={row.original.size}
          stok={row.original.stok}
          notes={row.original.notes}
          id={row.original.id}
          color={row.original.color}
          fileName={row.original.fileName}
          fileUrl={row.original.fileUrl}
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
          Detail Data Produk
        </div>
      ),
      body: <DetailCustomer id={row.original.id} />,
    });
  };

  return (
    <div className="flex gap-1 flex-col md:flex-row w">
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
  sizes,
}: {
  sizes: Size[];
}): ColumnDef<ColumnProductsDefProps>[] => [
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
    accessorFn: (row: ColumnProductsDefProps) => row.name ?? "",
    header: () => <div>Nama</div>,
     cell: ({ row }) => {
          const product = row.original.name;
          const imageUrl = row.original.fileUrl;
          return (
            <div className="flex items-center gap-3">
              <Image
                src={imageUrl ?? ""}
                className="w-10  h-10"
                width={100}
                height={100}
                priority
                alt={product}
              />
              <span className="font-medium">{product ?? "-"}</span>
            </div>
          );
        },
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sku
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ukuran
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("size")}</div>,
  },

  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} sizes={sizes} />,
  },
];
