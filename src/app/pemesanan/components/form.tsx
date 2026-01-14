"use client";
import React, { useEffect, useState } from "react";
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
import { SaveAllIcon, Trash2Icon, X } from "lucide-react";
import { formOrderSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addOrder, updateOrder } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import {
  Customer,
  OrderStatus,
  PaymentMethods,
  Product,
  SablonType,
  User,
} from "@prisma/client";
import { IconInvoice, IconUserCircle } from "@tabler/icons-react";
import { useSheet } from "@/components/providers/Sheet-provider";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createOrderNumber } from "@/lib/createOrderNumber";
import DateInput from "@/components/DateInput";
import { formatDateIDForm, toLocalDBFormat } from "@/lib/formatDateID";
import { Spinner } from "@/components/ui/spinner";

interface FormOrderProps {
  customer: Customer[];
  handle: User[];
  sablon: SablonType[];
  id?: string | null;
  products: Product[];
  payments: PaymentMethods[];
  stokInDb?: number | null;
}

type AreaSablons = {
  nama: string;
  jmlh: number;
};

const AreaSablon: AreaSablons[] = [
  {
    nama: "Depan",
    jmlh: 1,
  },
  {
    nama: "Belakang",
    jmlh: 1,
  },
  {
    nama: "Depan & Belakang",
    jmlh: 2,
  },
];

const statusOrder: string[] = Object.values(OrderStatus);
const FormPage = ({
  id,
  orderNumber,
  customerId,
  phone,
  email,
  address,
  createdAt,
  productionDue,
  product,
  color,
  unitPrice,
  quantity,
  totalAmount,
  notes,
  status,
  filename,
  customer,
  previewUrl,
  size,
  name,
  handleById,
  sablonTypeId,
  handle,
  sablon,
  colorCount,
  printArea,
  products,
  discountAmount,
  shippingFee,
  printAreas,
  paymentMethod,
  noPayment,
  payments,
  stokInDb,
}: Partial<z.infer<typeof formOrderSchema>> & FormOrderProps) => {
  const [preview, setPreview] = useState<string | null>(previewUrl ?? null);
  const [orderNumberValue, setOrderNumberValue] = useState<string | null>(
    orderNumber ?? ""
  );
  const [stok, setStok] = useState<number>(stokInDb ?? 0);
  const [loading, setLoading] = useState<boolean>(false);
  const { setOpen } = useSheet();
  const [noPayments, setNoPayments] = useState<number>(
    id && noPayment ? noPayment : 0
  );
  const [namePayment, setNamePayment] = useState<string>(
    id && paymentMethod ? paymentMethod : ""
  );
  const [productBasePrice, setProductBasePrice] = useState<number>(0);

  useEffect(() => {
    if (!id) {
      getOrderNumber();
    }
  }, []);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 15);

  const form = useForm<z.infer<typeof formOrderSchema>>({
    resolver: zodResolver(formOrderSchema),
    defaultValues: {
      customerId: customerId ?? "",
      handleById: handleById ?? "",
      sablonTypeId: sablonTypeId ?? "",
      name: name ?? "",
      size: size ?? "",
      address: address ?? "",
      phone: phone ?? "",
      email: email ?? "",
      product: product ?? "",
      color: color ?? "",
      filename: filename ?? "",
      status: status ?? "PENDING",
      notes: notes ?? "",
      createdAt: createdAt
        ? formatDateIDForm(createdAt ?? "")
        : new Date().toISOString(),
      unitPrice: unitPrice ?? 0,
      quantity: quantity ?? 0,
      totalAmount: totalAmount ?? 0,
      orderNumber: orderNumber ? orderNumber : orderNumberValue ?? "",
      productionDue: productionDue
        ? formatDateIDForm(productionDue ?? "")
        : currentDate.toISOString(),
      colorCount: colorCount ?? 0,
      printArea: printArea ?? 0,
      discountAmount: discountAmount ?? 0,
      shippingFee: shippingFee ?? 0,
      paymentMethod: paymentMethod ?? "",
      noPayment: noPayment ?? 0,
      printAreas: printAreas ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formOrderSchema>) => {
    const formData = new FormData();
    formData.append("notes", values.notes ?? "");
    formData.append("customerId", values.customerId);
    formData.append("product", values.product);
    formData.append("color", values.color);
    formData.append("filename", values.filename ?? "");
    formData.append("status", values.status);
    formData.append(
      "createdAt",
      toLocalDBFormat(new Date(values.createdAt ?? "")).toISOString()
    );
    formData.append("size", values.size);
    formData.append("unitPrice", JSON.stringify(values.unitPrice));
    formData.append("quantity", JSON.stringify(values.quantity));
    formData.append("totalAmount", JSON.stringify(values.totalAmount));
    formData.append("orderNumber", values.orderNumber);
    formData.append("phone", values.phone ?? "");
    formData.append("email", values.email ?? "");
    formData.append("address", values.address ?? "");
    formData.append("name", values.name ?? "");
    formData.append("printAreas", values.printAreas ?? "");
    formData.append(
      "productionDue",
      toLocalDBFormat(new Date(values.productionDue ?? "")).toISOString()
    );
    formData.append("handleById", values.handleById);
    formData.append("sablonTypeId", values.sablonTypeId);
    formData.append("colorCount", JSON.stringify(values.colorCount));
    formData.append("printArea", JSON.stringify(values.printArea));
    formData.append("shippingFee", JSON.stringify(values.shippingFee));
    formData.append("discountAmount", JSON.stringify(values.discountAmount));
    formData.append("paymentMethod", values.paymentMethod);
    formData.append("noPayment", JSON.stringify(values.noPayment));

    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateOrder(id, formData)
        : await addOrder(formData);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      }
      if (error) {
        toast.error("Ops...");
      }
    } catch (error) {
      toast.error("Ops...");
    } finally {
      setLoading(false);
    }
  };

  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };

  const getOrderNumber = async () => {
    const res = await createOrderNumber();
    setOrderNumberValue(res);
    form.setValue("orderNumber", res);
  };

  const findCustomer = (id: string) =>
    customer.find((e) => String(e.id) === id);

  useEffect(() => {
    const selected = products.find((e) => e.id === form.getValues("product"));
    if (selected) {
      const price = Number(selected.sellingPrice ?? 0);
      setProductBasePrice(price);
    }
  }, [products]);

  const sablonWatch = form.watch("sablonTypeId");
  const colorCountWatch = form.watch("colorCount");
  const printAreaWatch = form.watch("printArea");
  const qtyWatch = form.watch("quantity");

  // Hitung otomatis unitPrice & totalAmount
  useEffect(() => {
    const sab = sablon.find((e) => e.id === sablonWatch);

    const clr = Number(colorCountWatch ?? 1);
    const area = Number(printAreaWatch ?? 1);
    const qty = Number(qtyWatch ?? 1);

    const colorPrice = sab?.pricePerColor ?? 0;
    const sablonCost = sab ? sab.basePrice + colorPrice * clr * area : 0;

    const unit = productBasePrice + sablonCost;

    form.setValue("unitPrice", unit);
    form.setValue("totalAmount", unit * qty);
  }, [
    sablonWatch,
    colorCountWatch,
    printAreaWatch,
    qtyWatch,
    productBasePrice,
  ]);

  return (
    <div className="w-full mb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <Card className=" w-full rounded-sm bg-slate-100">
              <CardContent className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  <IconInvoice className="h-4 w-4" />
                  Nomor order :
                </span>
                <span className="font-medium text-primary">
                  {orderNumberValue ?? "-"}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* customer form */}
          <span className="flex items-center gap-1 text-muted-foreground font-medium">
            <IconUserCircle className="h-4 w-4" />
            Form data pelanggan
          </span>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Pemesan/pelanggan{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const customerValue = findCustomer(
                        form.getValues("customerId")
                      );
                      if (customerValue) {
                        form.setValue("phone", String(customerValue?.phone));
                        form.setValue("email", String(customerValue?.email));
                        form.setValue(
                          "address",
                          String(customerValue?.address)
                        );
                        form.setValue("name", customerValue.name);
                        form.clearErrors("phone");
                        form.clearErrors("email");
                        form.clearErrors("address");
                        form.clearErrors("name");
                      }
                    }}
                    defaultValue={field.value}
                    disabled={loading || id ? true : false}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pemesan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customer.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Nomor hp <span className="text-red-600 font-sm">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      readOnly
                      placeholder="Nomor hp"
                      {...field}
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Email <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="w-full "
                      readOnly
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
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
                      className="w-full "
                      readOnly
                      placeholder="Alamat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          {/* end customer form */}
          {/* product form */}
          <span className="flex items-center gap-1 text-muted-foreground font-medium">
            <IconUserCircle className="h-4 w-4" />
            Form data produk/barang
          </span>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="product"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Produk <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      const selected = products.find((e) => e.id === value);
                      if (!selected) return;
                      setStok(selected.stok);
                      form.setValue("size", selected.size ?? "");
                      form.setValue("color", selected.color ?? "");

                      const price = Number(selected.sellingPrice ?? 0);
                      setProductBasePrice(price);

                      form.setValue("unitPrice", price);

                      const qty = form.getValues("quantity") ?? 1;
                      form.setValue("totalAmount", price * qty);

                      form.clearErrors("size");
                      form.clearErrors("color");
                      form.clearErrors("quantity");
                      form.clearErrors("totalAmount");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih produk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          <Image
                            src={e.fileUrl ?? ""}
                            className="w-10  h-10"
                            width={100}
                            height={100}
                            priority
                            alt={e.name}
                          />{" "}
                          {e.name} - {e.size} - {e.color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Warna <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      readOnly
                      placeholder="Masukan warna"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          {/* handle */}
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="sablonTypeId"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Type Sablon <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const sab = sablon.find((e) => e.id === value);
                      if (!sab) return;

                      const colorCount = Number(form.getValues("colorCount"));
                      const printArea = Number(form.getValues("printArea"));
                      const colorPrice = sab.pricePerColor ?? 0;
                      const sablonCost =
                        sab.basePrice + colorPrice * colorCount * printArea;

                      const finalUnitPrice = productBasePrice + sablonCost;

                      form.setValue("unitPrice", finalUnitPrice);

                      const qty = form.getValues("quantity") ?? 1;
                      form.setValue("totalAmount", finalUnitPrice * qty);
                      form.clearErrors("quantity");
                      form.clearErrors("unitPrice");
                      form.clearErrors("totalAmount");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih type sablon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sablon.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1 w-full">
              <FormField
                control={form.control}
                name="colorCount"
                disabled={loading}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Jumlah Warna Cetak{" "}
                      <span className="text-red-600 font-sm">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full "
                        placeholder="jumlah warna cetak"
                        value={
                          form.getValues("colorCount") === 0 ? "" : field.value
                        }
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          form.setValue("colorCount", Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="printArea"
                disabled={loading}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Area Cetak <span className="text-red-600 font-sm">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const area = AreaSablon.filter((e) => e.nama === value);
                        field.onChange(area[0].jmlh);
                        form.setValue("printAreas", area[0].nama);
                      }}
                      defaultValue={printAreas}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih area cetak" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AreaSablon.map((e) => (
                          <SelectItem key={e.nama} value={e.nama}>
                            {e.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="size"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Ukuran <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Masukan ukuran"
                      readOnly
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Jumlah <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full "
                      placeholder="Jumlah"
                      value={
                        form.getValues("quantity") === 0 ? "" : field.value
                      }
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (value >= stok) {
                          form.setError("quantity", {
                            message: "Jumlah melebihi stok produk",
                          });
                        } else {
                          form.clearErrors("quantity");
                        }

                        field.onChange(value);
                        form.setValue("quantity", value);
                        const getUnitPrice = form.getValues("unitPrice");
                        if (getUnitPrice) {
                          const totalAmountValue = value * Number(getUnitPrice);
                          form.setValue("totalAmount", totalAmountValue);
                          form.clearErrors("totalAmount");
                        }
                      }}
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
              name="unitPrice"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Harga Satuan <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Harga satuan"
                      readOnly
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAmount"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Sub Total <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      className="w-full "
                      placeholder="Sub total"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          {/* end product form */}
          {/* design form */}
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="filename"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Desain File <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
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
          {/* end design form */}
          {/*  */}
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="status"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Status Pemesanan{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pemesanan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOrder.map((e) => (
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
            <FormField
              control={form.control}
              name="handleById"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Yang Mengerjakan{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih yang mengerjakan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {handle.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
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
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="shippingFee"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Biaya Pengiriman
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full "
                      placeholder="Biaya pengiriman"
                      value={form.getValues("shippingFee") ? field.value : ""}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                        form.setValue("shippingFee", Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discountAmount"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Diskon </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full "
                      placeholder="Diskon"
                      value={
                        form.getValues("discountAmount") !== 0
                          ? field.value
                          : ""
                      }
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                        form.setValue("discountAmount", Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="paymentMethod"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Metode pembayaran{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const findNoPayment = payments.filter(
                        (e) => e.name === value
                      );
                      if (value.toLowerCase() !== "cash") {
                        setNoPayments(Number(findNoPayment[0].no));
                        setNamePayment(findNoPayment[0].name);
                        form.setValue("noPayment", Number(findNoPayment[0].no));
                      }
                      if (value.toLowerCase() === "cash") {
                        setNoPayments(0);
                        setNamePayment("");
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full capitalize">
                      <SelectTrigger>
                        <SelectValue placeholder="Metode pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {payments.map((e) => (
                        <SelectItem
                          key={e.id}
                          value={e.name}
                          className="capitalize"
                        >
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-2 sm:mt-4 w-full">
            {noPayments !== 0 ? (
              <Card className=" px-4 py-2 rounded-sm text-lg font-medium capitalize">
                {namePayment} - {noPayments}
              </Card>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="createdAt"
              disabled={loading}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>
                      Tanggal pemesanan{" "}
                      <span className="text-red-600 font-sm">*</span>
                    </FormLabel>
                    <DateInput field={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="productionDue"
              disabled={loading}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>
                      Tanggal selesai{" "}
                      <span className="text-red-600 font-sm">*</span>
                    </FormLabel>
                    <DateInput field={field.value} onChange={field.onChange} />
                    <FormMessage />
                    <FormDescription className="text-sm text-muted-foreground">
                      Tanggal selesai otomatis + 15 hari dari tanggal pemesanan
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
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
                    placeholder="Catatan"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive min-h-[20px]" />
              </FormItem>
            )}
          />
          {/*  */}
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

export default FormPage;
