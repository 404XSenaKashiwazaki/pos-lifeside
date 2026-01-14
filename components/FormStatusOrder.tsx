"use client";
import { OrderStatus, PaymentStatus } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarArrowUp, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { formReportStatusOrderSchema } from "@/types/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOrders: string[] = Object.values(OrderStatus);

interface FormStatusOrderProps {
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
  startDate: Date;
  endDate: Date;
  orderStatus: OrderStatus | string;
  setOrderStatus: Dispatch<SetStateAction<OrderStatus | string>>;
}

const FormStatusOrder = ({
  endDate,
  startDate,
  orderStatus,
  setEndDate,
  setOrderStatus,
  setStartDate,
}: FormStatusOrderProps) => {
  const form = useForm<z.infer<typeof formReportStatusOrderSchema>>({
    resolver: zodResolver(formReportStatusOrderSchema),
    defaultValues: {
      startDate,
      endDate,
      statusOrder: orderStatus ?? "PENDING",
    },
  });

  function onSubmit(values: z.infer<typeof formReportStatusOrderSchema>) {
    localStorage.setItem("reportStatusOrder", values.statusOrder);
    setStartDate(values.startDate);
    setEndDate(values.endDate);
    setOrderStatus(values.statusOrder);
  }



  useEffect(() => {
    if (orderStatus && startDate && endDate)
      form.reset({
        endDate,
        startDate,
        statusOrder: orderStatus,
      });
  }, [orderStatus, startDate, endDate, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row items-end gap-2 w-full mb-10">
          <FormField
            control={form.control}
            name="statusOrder"
            render={({ field }) => (
              <FormItem className="w-full min-w-50 max-w-min-w-50 relative flex flex-col mb-2 md:mb-0 flex-1">
                <FormLabel>Status pemesanan</FormLabel>
                <Select
                  key={field.value} //catatatn force select ui yang tidak terselect default //
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status laporan pemesanan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOrders.map((e) => (
                      <SelectItem key={e} value={String(e)}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="absolute -bottom-4 text-xs text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-full relative flex flex-col flex-1">
                <FormLabel>Tanggal mulai</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="absolute -bottom-8 text-xs text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-full relative flex flex-col flex-1">
                <FormLabel>Tanggal akhir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="absolute -bottom-8 text-xs text-destructive" />
              </FormItem>
            )}
          />
          <Button type="submit">
            <CalendarArrowUp /> Cari
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormStatusOrder;
