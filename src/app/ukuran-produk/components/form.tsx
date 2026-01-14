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
import { SaveAllIcon, X } from "lucide-react";
import { formSizeSchema } from "@/types/zod";
import { toast } from "sonner";
import { FormSizeValue } from "@/types/form";
import { addData, updateData } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

const FormPage = ({
  id,
  name,
  chest,
  length,
  note,
  sleeve,
}: Partial<FormSizeValue>) => {
  const [loading, setLoading] = useState(false);
  const { setOpen } = useModal();
  const form = useForm<z.infer<typeof formSizeSchema>>({
    resolver: zodResolver(formSizeSchema),
    defaultValues: {
      name: name ?? "",
      chest: chest ?? 20,
      length: length ?? 20,
      sleeve: sleeve ?? 20,
      note: note ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSizeSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("chest", JSON.stringify(values.chest));
    formData.append("length", JSON.stringify(values.length));
    formData.append("sleeve", JSON.stringify(values.sleeve));
    formData.append("note", JSON.stringify(values.note));

    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateData(id, formData)
        : await addData(formData);
      console.log({ success });

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
              name="chest"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Lebar dada (cm) </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan lebar dada (cm) "
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
          <div className="flex flex-col sm:flex-row  sm:justify-between items-center gap-1">
            <FormField
              control={form.control}
              name="length"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Panjang badan (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan panjang badan (cm)"
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
              name="sleeve"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Panjang badan (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan panjang lengan (cm)"
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

          <FormField
            control={form.control}
            name="note"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Catatan </FormLabel>
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
