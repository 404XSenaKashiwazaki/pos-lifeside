"use client";
import {
  IconUserCircle,
} from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";
import { Customer } from "@prisma/client";
import { getCustomerById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailPembelianProps {
  id: string | null;
}

const DetailCustomer = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [customer, setCustomer] = useState<Customer | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getCustomerById(id);
        setCustomer(data ?? null);
      }
    });
  }, []);

  if (isPending) return <Skeleton className="w-full h-52" />;
  if (!customer) return <div>Tidak Ada Data.</div>;
  return (
    <div className="space-y-3">
      <div className="space-y-1">

        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Nama
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{customer.name ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            No Hp
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{customer.phone ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Email
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{customer.email ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Alamat
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{customer.address ?? "-"}</p>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Catatan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{customer.notes ?? "-"}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailCustomer;
