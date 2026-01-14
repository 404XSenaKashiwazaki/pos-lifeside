"use client";

import React, { useEffect, useState, useTransition } from "react";

import { User } from "@prisma/client";
import { getUsersById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";

interface DetailPembelianProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<User | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getUsersById(id);
        setData(data ?? null);
      }
    });
  }, []);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e.}))
  if (isPending) return <Skeleton className="w-full h-52" />;
  if (!data) return <div>Tidak Ada Data.</div>;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex flex-col  gap-1 sm:gap-3 items-center">
          <div className="w-full">
            <Image
              src={data.imageUrl ?? previewImg}
              alt="profile"
              width={500}
              height={500}
              className="rounded-sm"
            />
          </div>

          <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Nama
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.name ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Email
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.email ?? "-"}</p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                LEVEL
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>
                  <Button
                    className="capitalize"
                    size={"sm"}
                    variant={"default"}
                  >
                    {data.role}
                  </Button>
                </p>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground  w-full">
                Alamat
              </span>
              <span className="font-xs text-primary  w-full  flex items-start gap-1">
                <p>:</p>
                <p>{data.address ?? "-"}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
