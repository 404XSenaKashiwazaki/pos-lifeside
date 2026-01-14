"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/providers/Modal-provider";
import { SaveAllIcon, X } from "lucide-react";
import { formPaymentMethodsSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCustomerValue } from "@/types/form";
import { storeData, updateData } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

const FormPage = ({
  id,
  description,
  name,
  no,
}: Partial<z.infer<typeof formPaymentMethodsSchema>> & { id?: string }) => {
  const [loading, setLoading] = useState(false);
  const { setOpen } = useModal();
  const form = useForm<z.infer<typeof formPaymentMethodsSchema>>({
    resolver: zodResolver(formPaymentMethodsSchema),
    defaultValues: {
      name: name ?? "",
      no: no ?? 0,
      description: description ?? "",
    },
  });
  console.log({ form: form.formState.errors });
  const onSubmit = async (values: z.infer<typeof formPaymentMethodsSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("no", JSON.stringify(values.no));
    formData.append("description", values.description ?? "");

    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateData(id, formData)
        : await storeData(formData);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
        setLoading(false);
      }
      if (error) toast.error("Ops...");
    } catch (error) {
      toast.error("Ops...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Nama <span className="text-red-600 font-sm">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="w-full "
                    placeholder="Masukan nama"
                    disabled={loading}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      form.clearErrors("no");
                    }}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="no"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nomor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full"
                    placeholder="Masukan nomor"
                    disabled={loading}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                      form.clearErrors("no");
                    }}
                    defaultValue={field.value === 0 ? "" : field.value}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
                <FormDescription>
                  Nomor rekening / e-wallet wajib diisi untuk metode pembayaran
                  non-cash.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan deskripsi"
                    disabled={loading}
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
              variant="destructive"
              disabled={loading}
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
