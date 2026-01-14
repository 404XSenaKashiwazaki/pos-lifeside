"use client";
import React, { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { formProfileSchema } from "@/types/zod";
import { Session } from "next-auth";
import { SaveAllIcon, Trash2Icon, X } from "lucide-react";
import { useSheet } from "@/components/providers/Sheet-provider";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import { updateProfile } from "../actions";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
interface PageProps {
  id: string | null;
  email: string | null;
  imageUrl: string | null;
  update: (data?: Partial<Session>) => Promise<Session | null>;
}

const FormPage = ({
  email,
  address,
  phone,
  image,
  imageUrl,
  id,
  update,
}: Partial<z.infer<typeof formProfileSchema>> & PageProps) => {
  const [preview, setPreview] = useState<string | null>(
    (imageUrl ? (imageUrl as string) : (image as string)) ?? null
  );

  const { setOpen } = useSheet();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formProfileSchema>>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      address,
      phone,
      image,
    },
  });

  const onSubmit = async (values: z.infer<typeof formProfileSchema>) => {
    const formData = new FormData();
    if (!id) return;
    formData.append("phone", JSON.stringify(values.phone));
    formData.append("address", values.address);
    formData.append("imageUrl", imageUrl);
    formData.append("image", values.image ?? "");
    try {
      setLoading(true);
      const {
        success,
        message,
        data: res,
        error,
      } = await updateProfile(id, formData);
      if (success) {
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
        setLoading(false);
        setOpen(false);

        if (error) toast.error("Ops...");
        if (res) {
          await update({
            user: {
              name: res.name,
              address: res.address,
              email: res.email,
              role: res.role,
              imageUrl: res.imageUrl,
              phone: Number(res.phone),
            },
          });
        }
      }
    } catch (error) {
      toast.error("Ops...");
    } finally {
      setLoading(false);
    }
    // if (res.data) await update({ user: res.data.user });
  };
  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid w-full max-w-sm items-center gap-3">
            <FormLabel>Email</FormLabel>
            <Input
              disabled
              type="email"
              value={email ?? ""}
              placeholder="Email"
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  No hp <span className="text-red-600 font-sm">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full"
                    disabled={loading}
                    placeholder="Masukan no hp"
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                    value={field.value === 0 ? "" : field.value}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive min-h-[20px]" />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-start gap-1 mb-10">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full mb-4">
                  <FormLabel>Foto profile</FormLabel>
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
                <CardTitle>Preview foto profile</CardTitle>
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Masukan alamat"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-1 flex gap-1 flex-col md:flex-row">
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              onClick={() => setOpen(false)}
            >
              <X />
              Batal
            </Button>
            <Button type="submit" variant="destructive" size={"sm"}>
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
