"use client";
import React, { useRef, useState } from "react";
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
import { SaveAllIcon, X } from "lucide-react";
import { formHargaJenisSchema } from "@/types/zod";
import { toast } from "sonner";
import { FormHargaJenisValue } from "@/types/form";
import { addHargaJenis, updateHargaJenis } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

const FormHargaJenis = ({
  id,
  name,
  basePrice,
  description,
  isActive,
  pricePerArea,
  pricePerColor,
  baseCost,
  costPerArea,
  costPerColor,
  notes,
}: Partial<FormHargaJenisValue>) => {
  const [loading, setLoading] = useState(false);
  const { setOpen } = useModal();
  const form = useForm<z.infer<typeof formHargaJenisSchema>>({
    resolver: zodResolver(formHargaJenisSchema),
    defaultValues: {
      name: name ?? "",
      description: description ?? "",
      basePrice: basePrice ?? 0,
      pricePerColor: pricePerColor ?? 0,
      pricePerArea: pricePerArea ?? 0,
      notes: notes ?? "",
      baseCost: baseCost ?? 0,
      costPerArea: costPerArea ?? 0,
      costPerColor: costPerColor ?? 0,
      isAtive: isActive ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formHargaJenisSchema>) => {
    console.log({ values });
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("description", values.description);
    formData.set("basePrice", JSON.stringify(values.basePrice));
    formData.set("pricePerColor", JSON.stringify(values.pricePerColor));
    formData.set("pricePerArea", JSON.stringify(values.pricePerArea));
    formData.set("baseCost", JSON.stringify(values.baseCost));
    formData.set("costPerColor", JSON.stringify(values.costPerColor));
    formData.set("costPerArea", JSON.stringify(values.costPerArea));
    formData.set("notes", values.notes ?? "");
    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateHargaJenis(id, formData)
        : await addHargaJenis(formData);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      }
      if (error) toast.error("Ops..");
    } catch (error) {
      toast.error("Ops...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
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
                      disabled={loading}
                      placeholder="Masukan nama"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseCost"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Modal Awal <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan modal awal"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                       defaultValue={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="costPerColor"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Modal Per Warna</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan modal per warna"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                       defaultValue={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costPerArea"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Modal Per Area</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan modal per area"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      defaultValue={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="basePrice"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga Awal <span className="text-red-600 font-sm">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      disabled={loading}
                      placeholder="Masukan harga awal"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                       defaultValue={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="pricePerColor"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga Per Warna</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      disabled={loading}
                      placeholder="Masukan harga per warna"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                       defaultValue={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricePerArea"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga Per Area</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan harga per area"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                       defaultValue={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Deskripsi <span className="text-red-600 font-sm">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    disabled={loading}
                    placeholder="Masukan deskripsi"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    disabled={loading}
                    placeholder="Masukan catatan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex md:flex-row flex-col justify-end gap-2 mt-5">
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

export default FormHargaJenis;
