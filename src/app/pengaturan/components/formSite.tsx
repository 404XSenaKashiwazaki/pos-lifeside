"use client";

import { useSheet } from "@/components/providers/Sheet-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { formSiteSchema } from "@/types/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, z } from "zod";
import { storeSite } from "../actions";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaveAllIcon, Trash2Icon, X } from "lucide-react";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import { Spinner } from "@/components/ui/spinner";

interface FormSiteProps {
  name?: string;
  filename?: string;
  fileUrl?: string;
  email?: string;
  address?: string;
  phone?: string;
}
const FormSite: React.FC<FormSiteProps> = ({
  name,
  filename,
  fileUrl,
  address,
  email,
  phone,
}) => {
  const [preview, setPreview] = useState<string | null>(fileUrl ?? null);
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSheet();
  const form = useForm<z.input<typeof formSiteSchema>>({
    resolver: zodResolver(formSiteSchema),
    defaultValues: {
      name: name ?? "",
      filename: filename ?? "",
      address: address ?? "",
      email: email ?? "",
      phone: phone ?? "",
    },
  });
  const onSubmit = async (values: z.input<typeof formSiteSchema>) => {
    const formData = new FormData();

    // Object.entries(values).forEach(([e, val]) => formData.append(e, val));

    Object.entries(values).forEach(([key, val]) => {
      if (key === "filename") {
        if (val instanceof File) {
          formData.append(key, val);
        }
        return;
      }

      if (val !== null && val !== undefined) {
        formData.append(key, val);
      }
    });

    try {
      setLoading(true);
      const { success, message, error, data } = await storeSite(formData);
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nama App</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan aplikasi"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan nomor telephone"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
              </FormItem>
            )}
          />

          <div className="flex flex-col items-start gap-1">
            <FormField
              control={form.control}
              name="filename"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Logo</FormLabel>
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
                <CardTitle>Preview Logo</CardTitle>
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
                    width={100}
                    height={100}
                    priority
                    className="w-52 h-52"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <FormField
            control={form.control}
            name="address"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan alamat"
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

export default FormSite;
