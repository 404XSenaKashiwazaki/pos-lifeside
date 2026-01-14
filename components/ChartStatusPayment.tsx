"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ByStatusOrdersToCard,
  getByStatusOrdersToCartRes,
  getByStatusPaymentsToCartRes,
} from "@/app/laporan/queries";

export const description = "An interactive area chart";

const chartData = [
   {
    date: "2024-10-25",
    pending: 1,
    paid: 0,
    failed: 0,
    refunded: 0,
  },
  {
    date: "2024-10-26",
    pending: 10,
    paid: 0,
    failed: 0,
    refunded: 0,
  },
];

const chartConfig = {
  pending: {
    label: "Pending",
    color: "var(--color-PENDING)",
  },
  paid: {
    label: "Paid",
    color: "var(--chart-3)",
  },
  failed: {
    label: "Failed",
    color: "var(--chart-1)",
  },
  refunded: {
    label: "Refunded",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const SelectItems = [
  {
    value: "90d",
    title: "3 Bulan terakhir",
  },
  {
    value: "30d",
    title: "30 Hari terakhir",
  },
  {
    value: "7d",
    title: "7 Hari terakhir",
  },
];

interface ChartByStatusPaymentsProps {
  data: getByStatusPaymentsToCartRes[];
}
const ChartStatusPayment = ({ data }: ChartByStatusPaymentsProps) => {
  const [timeRange, setTimeRange] = React.useState<string>("90d");
  const [range, setRange] = React.useState<string>("");
  const [totalRange, setTotalRange] = React.useState("Last 3 months");
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  React.useEffect(() => {
    setTimeRange(localStorage.getItem("timeRangePayments") ?? "7d");
    setRange(localStorage.getItem("chartRangePaymentsKey") ?? "7 hari terakhir");
  }, []);


  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Chart Pembayaran</CardTitle>
          <CardDescription>
            Menampilkan total Pembayaran untuk {range} di{" "}
            {new Date().getFullYear()}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(e) => {
            const select = SelectItems.find((e2) => e == e2.value);
            setTotalRange(select?.title ?? "Last 3 months");
            localStorage.setItem("timeRangePayments", e);
            setRange(select?.title ?? "");
            localStorage.setItem("chartRangePaymentsKey", select?.title ?? "");
            setTimeRange(e);
          }}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {SelectItems.map((e) => (
              <SelectItem value={e.value} key={e.value} className="rounded-lg">
                {e.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRefunded" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* {{  { date: "2024-06-30", pending: 446, confirmed: 400,  processing: 4, printing: 4,finishing: 5,completed: 1, cancelled: 1, onhold: 1 },}} */}
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke="var(--color-pending)"
              stackId="a"
            />
            <Area
              dataKey="paid"
              type="natural"
              fill="url(#fillPending)"
              stroke="var(--chart-3)"
              stackId="a"
            />
            <Area
              dataKey="failed"
              type="natural"
              fill="url(#fillPaid"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="refunded"
              type="natural"
              fill="url(#fillRefunded)"
              stroke="var(--chart-5)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartStatusPayment;
