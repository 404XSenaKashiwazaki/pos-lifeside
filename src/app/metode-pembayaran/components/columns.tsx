"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit2Icon, SearchCheck, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnPaymentMethodsDefProps } from "@/types/datatable";
import FormCustomer from "./form";
import DetailCustomer from "./detail";
import DeleteModal from "./delete";
import {
  IconAlertCircle,
  IconInfoCircle,
  IconPencil,
} from "@tabler/icons-react";

const CellAction = ({ row }: { row: Row<ColumnPaymentMethodsDefProps> }) => {
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
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus user Anda secara permanen",
      body: <DeleteModal id={row.original.id} setOpen={setOpen} />,
    });
  };

  const showModalEdit = () => {
    modal({
      title: (
        <div className="flex gap-1">
          <IconPencil className="h-5 w-5" />
          Edit Data Metode Pembayaran
        </div>
      ),
      body: (
        <FormCustomer
          id={row.original.id}
          description={row.original.description ?? ""}
          name={row.original.name}
          no={Number(row.original.no) ?? 0}
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
          Detail Metode Pembayaran
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

export const columns = (): ColumnDef<ColumnPaymentMethodsDefProps>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return <div> Nama</div>;
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "no",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nomor
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {Number(row.original.no) === 0 ? "" : row.getValue("no")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} />,
  },
];
