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
import { formUserSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormUserValue } from "@/types/form";
import { addUser, updateUser } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { UserRole } from "@prisma/client";

const roles = Object.values(UserRole);
const FormPage = ({
  id,
  name,
  email,
  phone,
  address,
  role,
}: Partial<FormUserValue>) => {
  const [loading, setLoading] = useState(false);
  const { setOpen } = useModal();
  const form = useForm<z.infer<typeof formUserSchema>>({
    resolver: zodResolver(formUserSchema),
    defaultValues: {
      name: name ?? "",
      phone: Number(phone || 0) ?? 0,
      email: email ?? "",
      address: address ?? "",
      role: role ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formUserSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", JSON.stringify(values.phone));
    formData.append("address", values.address);
    formData.append("role", values.role);
    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateUser(id, formData)
        : await addUser(formData);
     

      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
        if (error) toast.error("Ops...");
      }
    } catch (error) {
      toast.error("Ops...");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
 

  return (
    <div className="w-full px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1 mb-10">
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
                      disabled={loading}
                      placeholder="Masukan nama"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
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
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Email <span className="text-red-600 font-sm">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="w-full"
                    disabled={loading}
                    placeholder="Masukan email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive min-h-[20px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Alamat <span className="text-red-600 font-sm">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    disabled={loading}
                    placeholder="Masukan alamat"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive min-h-[20px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Produk <span className="text-red-600 font-sm">*</span>
                </FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.clearErrors("role");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
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
            <Button size={"sm"} variant={"destructive"}>
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
