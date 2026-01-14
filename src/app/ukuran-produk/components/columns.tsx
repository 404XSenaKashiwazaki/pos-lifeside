"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit2Icon, SearchCheck, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnSizesDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailCustomer from "./detail";
import DeleteModal from "./delete";
import {
  IconAlertCircle,
  IconInfoCircle,
  IconPencil,
} from "@tabler/icons-react";


const CellAction = ({ row }: { row: Row<ColumnSizesDefProps> }) => {
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
          <IconPencil className="h-5 w-5" /> Edit Data Ukuran Produk
        </div>
      ),
      body: (
        <FormPage
          name={row.original.name}
          chest={row.original.chest}
          id={row.original.id}
          length={row.original.length}
          sleeve={row.original.sleeve}
          note={row.original.note}
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
          Detail Data Ukuran Produk
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

export const columns = (): ColumnDef<ColumnSizesDefProps>[] => [
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
    accessorFn: (row: ColumnSizesDefProps) => row.name ?? "",
    header: () => <div>Nama</div>,
    cell: (info) => info.getValue(),
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "chest",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lebar dada
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("chest")}</div>
    ),
  },
  {
    accessorKey: "length",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Panjang badan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("length")}</div>
    ),
  },
  {
    accessorKey: "sleeve",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Panjang lengan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("sleeve")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} />,
  },
];
