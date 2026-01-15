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
import { formPaymentSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPayment, updatePayment } from "../actions";
import { useSheet } from "@/components/providers/Sheet-provider";
import DateInput from "@/components/DateInput";
import {
  PaymentMethod,
  PaymentMethods,
  PaymentStatus,
  PaymentType,
  Prisma,
} from "@prisma/client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import { formatCurrency } from "@/lib/formatCurrency";
import { Textarea } from "@/components/ui/textarea";
import { formatDateIDForm, toLocalDBFormat } from "@/lib/formatDateID";
import { Spinner } from "@/components/ui/spinner";
import { error } from "console";

interface FormOrderProps {
  orderAmount?: number | null;
  payments: PaymentMethods[];
  id?: string | null;
  product?: string | null;
  orders: Prisma.OrderGetPayload<{
    include: {
      customer: true;
      designs: true;
      items: {
        include: {
          products: true;
        };
      };
      payments: true;
    };
  }>[];
}

const paymentType: string[] = Object.values(PaymentType);
const paymentStatus: string[] = Object.values(PaymentStatus);

const FormPage = ({
  id,
  orders,
  amount,
  method,
  orderId,
  paidAt,
  reference,
  status,
  type,
  notes,
  product,
  payments,
  amountReturn,
  orderAmount,
}: Partial<z.infer<typeof formPaymentSchema>> & FormOrderProps) => {
  const [remainingPayment, setRemainingPayment] = useState<
    number | string | null
  >(null);

  const [paymentTotal, setPaymentTotal] = useState<string | number | null>(
    id ? orderAmount ?? null : null
  );
  const [preview, setPreview] = useState<string | null>(
    (reference as string) ?? null
  );
  const [change, setChange] = useState<number>(0);
  const [noPayment, setNoPayment] = useState<number>(0);
  const [namePayment, setNamePayment] = useState<string>("");

  const [totalAmount, setTotalAmount] = useState(id ? amount : 0);
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSheet();
  const [readonly, setReadonly] = useState(id ? false : true);
  const [readonlyAll, setReadonlyAll] = useState(false);
  const [dataOrders, setDataOrders] = useState<
    Prisma.OrderGetPayload<{
      include: {
        customer: true;
        designs: true;
        items: {
          include: {
            products: true;
          };
        };
        payments: true;
      };
    }>[]
  >([]);
  const form = useForm<z.infer<typeof formPaymentSchema>>({
    resolver: zodResolver(formPaymentSchema),
    defaultValues: {
      amount: id ? amount : totalAmount ?? 0,
      method: method ?? "",
      paidAt: paidAt
        ? formatDateIDForm(paidAt ?? "")
        : new Date().toISOString(),
      orderId: orderId ?? "",
      reference: reference ?? "",
      status: status ?? "",
      type: type ?? "",
      notes: notes ?? "",
      amountReturn: amountReturn ?? 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formPaymentSchema>) => {
    const formData = new FormData();

    formData.append("orderId", values.orderId);
    formData.append(
      "paidAt",
      toLocalDBFormat(new Date(values.paidAt ?? "")).toISOString()
    );
    formData.append("amount", JSON.stringify(values.amount));
    formData.append("method", values.method);
    formData.append("type", values.type);
    formData.append("status", values.status);
    formData.append("reference", values.reference);
    formData.append("notes", values.notes ?? "");
    formData.append("amountReturn", JSON.stringify(change));

    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updatePayment(id, formData)
        : await addPayment(formData);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
        if (error) toast.error("Ops....");
      }
    } catch (error) {
      toast.error("Opsss.....");
    } finally {
      setLoading(false);
    }
  };

  const findCustomerProduct = (id: string) =>
    orders.find((e) => String(e.id) === id);

  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };

  useEffect(() => {
    if (amount && orderAmount) {
      if (amount > orderAmount) {
        setRemainingPayment("");
      }
    }
    if (!id) {
      setDataOrders(orders.filter((e) => e.payments.length === 0));
    } else {
      setDataOrders(orders.filter((e) => e.id === id));
    }
  }, [id, orders]);

  useEffect(() => {
    if (id && paymentTotal && totalAmount) {
      const bayar = Number(totalAmount);
      const tagihan = Number(paymentTotal);

      if (bayar > tagihan) {
        setChange(bayar - tagihan);
        setRemainingPayment(0);
      } else if (bayar === tagihan) {
        setChange(0);
        setRemainingPayment(0);
      } else {
        setChange(0);
        setRemainingPayment(tagihan - bayar);
      }
    }
  }, [id, paymentTotal, totalAmount]);


  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-5 w-full">
            {id ? (
              <>
                <div className="grid w-full items-center gap-0 m-0">
                  <label
                    htmlFor="remainingPayment"
                    className="font-medium text-sm m-0"
                  >
                    Pemesan dan produk pesanan
                  </label>
                  <div className="flex flex-col sm:flex-row  gap-1 rounded-sm bg-slate-200 py-1 px-2">
                    {orders[0]?.customer.name} -{" "}
                    <Image
                      src={orders[0].designs[0].fileUrl ?? ""}
                      alt={orders[0].items[0].products.name}
                      width={100}
                      height={100}
                      className="w-6 h-6 rounded-sm"
                    />
                    {orders[0].items[0].products.name} -{" "}
                    {orders[0].items[0].products.size} -{" "}
                    {orders[0].items[0].products.color}{" "}
                    {
                      <span className="capitalize">
                        {orders[0].paymentMethod}
                      </span>
                    }
                  </div>
                </div>
              </>
            ) : (
              <FormField
                control={form.control}
                name="orderId"
                disabled={loading}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Pemesan dan produk pesanan{" "}
                      <span className="text-red-600 font-sm">*</span>
                    </FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => {
                        setReadonly(false);
                        field.onChange(value);
                        // if(!id) form.setValue("method","")
                        form.setValue("orderId", value);
                        const getCountAmount = findCustomerProduct(value);
                        const amountTotal = getCountAmount?.totalAmount;
                        if (getCountAmount?.payments.length !== 0) {
                          const totalRemainingPayment =
                            getCountAmount?.payments?.reduce(
                              (sum, payment) =>
                                sum + (Number(payment.amount) ?? 0),
                              0
                            );
                          const amountRemaining =
                            Number(amountTotal) - Number(totalRemainingPayment);
                          if (amountRemaining > 0) {
                            setRemainingPayment(amountRemaining);
                          } else {
                            setRemainingPayment(0);
                          }

                          // form.setValue("amount", amountRemaining ??0);
                        } else {
                          // form.setValue("amount", amountTotal ?? 0);
                          if (amountTotal) setRemainingPayment(amountTotal);
                        }
                        if (amountTotal) setPaymentTotal(amountTotal);
                        // form.clearErrors("amount");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pemesan dan produk yang dipesan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataOrders.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.customer.name} -{" "}
                            <Image
                              src={e.designs[0].fileUrl ?? ""}
                              alt={e.items[0].products.name}
                              width={100}
                              height={100}
                              className="w-6 h-6 rounded-sm"
                            />
                            {e.items[0].products.name} -{" "}
                            {e.items[0].products.size} -{" "}
                            {e.items[0].products.color} -{" "}
                            {
                              <span className="capitalize">
                                {e.paymentMethod}
                              </span>
                            }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Untuk mengisi form pembayaran, silahkan pilih pemesan
                      terlebih dahulu. Orderan/pemesanan yang sudah lunas tidak
                      akan tampil.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1 ">
            <div className="grid w-full max-w-sm items-center gap-0 m-0">
              <label
                htmlFor="remainingPayment"
                className="font-medium text-sm m-0"
              >
                Total tagihan pembayaran
              </label>
              <Input
                readOnly
                id="remainingPayment"
                className="mt-0.5 w-full"
                placeholder="Total tagihan"
                disabled={loading}
                value={paymentTotal ?? ""}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-0 m-0">
              <label
                htmlFor="remainingPayment"
                className="font-medium text-sm m-0"
              >
                Sisa tagihan pembayaran
              </label>
              <Input
                readOnly
                id="remainingPayment"
                className="mt-0.5 w-full"
                placeholder="Sisa tagihan"
                disabled={loading}
                value={remainingPayment ?? ""}
              />
            </div>
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="amount"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Total pembayaran{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full "
                      placeholder="Total"
                      readOnly={readonly}
                      disabled={loading}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(value);
                        setTotalAmount(value);

                        if (paymentTotal) {
                          const remainingAmount = Number(paymentTotal) - value;

                          if (value < Number(paymentTotal)) {
                            setRemainingPayment(remainingAmount);
                            setChange(0); // kembalian 0 karena masih kurang
                            setReadonly(false);
                          }

                          if (value === Number(paymentTotal)) {
                            setRemainingPayment(0);
                            setChange(0);
                          }

                          if (value > Number(paymentTotal)) {
                            const kembalian = value - Number(paymentTotal);
                            setRemainingPayment(0);
                            setChange(kembalian); // hitung kembalian
                          }
                        }
                      }}
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                  <FormDescription className="mb-4">
                    {remainingPayment ? (
                      <span className="mt-2 font-medium block">
                        Harap untuk mengisi total pembayaran sesuai sisa tagihan
                        — {formatCurrency(Number(remainingPayment))}
                      </span>
                    ) : change || amountReturn ? (
                      <span className="mt-2 font-medium block">
                        Kembalian:{" "}
                        {formatCurrency(change || (amountReturn ?? 0))}
                      </span>
                    ) : null}
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              type="button"
              size="sm"
              disabled={loading}
              onClick={() => {
                setTotalAmount(0);
                form.resetField("amount");
                setRemainingPayment(paymentTotal);
                setReadonly(false);
              }}
            >
              Reset input pembayaran
            </Button>
          </div>

          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1 ">
            <FormField
              control={form.control}
              name="type"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Type pembayaran{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Type pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentType.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
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
                        (e) => e.id === value
                      );
                      setNoPayment(Number(findNoPayment[0].no));
                      setNamePayment(findNoPayment[0].name);
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
                          value={e.id}
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
            {noPayment !== 0 ? (
              <Card className=" px-4 py-2 rounded-sm text-lg font-medium capitalize">
                {namePayment} - {noPayment}
              </Card>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="status"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Status pembayaran{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Status pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentStatus.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidAt"
              disabled={loading}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>
                      Tanggal pembayaran{" "}
                      <span className="text-red-600 font-sm">*</span>
                    </FormLabel>
                    <DateInput field={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1 mb-10">
            <FormField
              control={form.control}
              name="reference"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Bukti pembayaran{" "}
                    <span className="text-red-600 font-sm">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="w-full"
                      accept="image/*"
                      disabled={loading}
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
                <CardTitle>Preview bukti pembayaran</CardTitle>
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
                    placeholder="Catatan"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive min-h-[20px]" />
              </FormItem>
            )}
          />
          <div className="flex md:flex-row flex-col justify-end gap-2 mt-10 mb-6">
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
