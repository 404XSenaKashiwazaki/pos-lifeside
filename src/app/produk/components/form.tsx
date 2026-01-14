"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/providers/Modal-provider";
import { SaveAllIcon, Trash2Icon, X } from "lucide-react";
import { formProductSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormProdukValue } from "@/types/form";
import { addData, updateData } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Size } from "@prisma/client";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import { Spinner } from "@/components/ui/spinner";

const FormPage = ({
  id,
  name,
  color,
  fileName,
  fileUrl,
  stok,
  purchaseCost,
  sellingPrice,
  size,
  notes,
  sizes,
}: Partial<FormProdukValue> & { sizes: Size[] }) => {
  const [preview, setPreview] = useState<string | null>(fileUrl ?? null);
  const [loading, setLoading] = useState(false);
  const { setOpen } = useModal();
  const form = useForm<z.input<typeof formProductSchema>>({
    resolver: zodResolver(formProductSchema),
    defaultValues: {
      name: name ?? "",
      color: color ?? "",
      fileName: fileName ?? "",
      purchaseCost: purchaseCost ?? 1000,
      sellingPrice: sellingPrice ?? 1000,
      size: size ?? "",
      stok: stok ?? 1,
      notes: notes ?? "",
    },
  });

  const onSubmit = async (values: z.input<typeof formProductSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("color", values.color);
    if (values.fileName instanceof File) {
      formData.append("fileName", values.fileName);
    } else if (typeof values.fileName === "string") {
      formData.append("fileName", values.fileName);
    }

    formData.append("name", values.size);
    formData.append("purchaseCost", JSON.stringify(values.purchaseCost));
    formData.append("sellingPrice", JSON.stringify(values.sellingPrice));
    formData.append("stok", JSON.stringify(values.stok));
    formData.append("notes", JSON.stringify(values.notes));
    formData.append("size", values.size);
    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateData(id, formData)
        : await addData(formData);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      }
      if (error) {
        console.log({ error });
        toast.error("Ops...");
      }
    } catch (error) {
      console.log({ error });

      toast.error("Ops...");
    } finally {
      setLoading(false);
    }
  };

  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };

  return (
    <div className="w-full ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
          <div className="flex flex-col sm:flex-row  sm:justify-between items-center gap-1">
            <FormField
              control={form.control}
              name="name"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nama <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      placeholder="Masukan nama"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Warna <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Masukan warna "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row  sm:justify-between items-center gap-1">
            <FormField
              control={form.control}
              name="stok"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Stok <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan stok"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Ukuran <span className="text-red-600 font-sm">*</span></FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((e) => (
                        <SelectItem key={e.id} value={e.name}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row  sm:justify-between items-center gap-1">
            <FormField
              control={form.control}
              name="purchaseCost"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga Pembelian/Modal <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan harga pembelian"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellingPrice"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga Jual <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan harga jual"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="fileName"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Desain File <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="w-full"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file ?? null);
                        if (file) setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />

            <Card className="rounded-sm w-full">
              <CardHeader>
                <CardTitle>Preview desain file</CardTitle>
                <CardAction>
                  <Button
                    type="button"
                    disabled={preview ? false : true}
                    onClick={deleteFileImagePreview}
                    variant={"destructive"}
                  >
                    <Trash2Icon />
                    Hapus
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <Image
                    src={preview ?? previewImg}
                    alt="Preview desain file"
                    width={500}
                    height={500}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <FormField
            control={form.control}
            name="notes"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan catatan"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2 mt-5">
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              <X />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="destructive"
              size={"sm"}
            >
              {loading ? (
                <div className="flex gap-1 items-center">
                  <Spinner className="size-3" />
                  Loading...
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <SaveAllIcon /> Simpan
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPage;
