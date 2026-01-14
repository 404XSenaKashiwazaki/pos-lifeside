"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Edit2Icon, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnProductionTypeDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailPage from "./detail";
import { SablonType, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  IconAlertCircle,
  IconCreditCardPay,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useSheet } from "@/components/providers/Sheet-provider";
import DeleteModal from "./delete";
import Image from "next/image";

interface CellActionProps {
  row: Row<ColumnProductionTypeDefProps>;
  handle: User[];
  sablon: SablonType[];
}

const CellAction = ({ row, handle, sablon }: CellActionProps) => {
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
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus produksi Anda secara permanen",
      body: <DeleteModal id={row.original.id} setOpen={setOpen} />,
    });
  };

  const showModalEdit = () => {
    sheet({
      title: (
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconCreditCardPay className="h-4 w-4" />
          Form edit data produksi
        </span>
      ),
      description: "form untuk edit data produksi ",
      content: (
        <FormPage
          handle={handle}
          sablon={sablon}
          id={row.original.id}
          orderItemId={row.original.orderItemId}
          assignedToId={row.original.assignedToId ?? ""}
          endDate={row.original.endDate ?? ""}
          startDate={row.original.startDate ?? ""}
          notes={row.original.notes ?? ""}
          progress={String(row.original.progress)}
          sablonTypeId={row.original.sablonTypeId ?? ""}
          status={row.original.status}
          fileProofUrl={row.original.fileProofUrl ?? undefined}
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
          Detail Data Produksi
        </div>
      ),
      body: <DetailPage id={row.original.id} />,
      size: "sm:max-w-2xl",
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
      {/* <Button
        variant="destructive"
        size={"sm"}
        onClick={() => showModalDelete()}
      >
        <Trash2Icon />
        Hapus
      </Button> */}
    </div>
  );
};

export const columns = ({
  handle,
  sablon,
}: {
  handle: User[];
  sablon: SablonType[];
}): ColumnDef<ColumnProductionTypeDefProps>[] => [
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
    accessorFn: (row: ColumnProductionTypeDefProps) =>
      row.assignedTo?.name ?? "",
    header: () => <div>Yang mengerjakan</div>,
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
    cell: ({ row }) => (
      <div className="capitalize flex gap-1 items-center overflow-hidden">
        <Image
          src={row.original.orderItem.order.designs[0].fileUrl ?? ""}
          alt={row.original.orderItem.products.name ?? ""}
          width={100}
          height={100}
          className="w-10 h-10 rounded-sm"
        />
        {row.original.orderItem.products.name} -{" "}
        {row.original.orderItem.products.size} -{" "}
        {row.original.orderItem.products.color}{" "}
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal pengerjaan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{format(row.getValue("startDate"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "endDate",
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
      <div className="">{format(row.getValue("endDate"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div>Type sablon</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant={"default"}>{row.original.sablonType?.name}</Badge>
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
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction handle={handle} sablon={sablon} row={row} />,
  },
];
