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
import { ByStatusOrdersToCard, getByStatusOrdersToCartRes } from "@/app/laporan/queries";

export const description = "An interactive area chart";

const chartData = [
   
  {
    date: "2024-10-25",
    pending: 1,
    confirmed: 0,
    processing: 0,
    printing: 0,
    finishing: 0,
    completed: 0,
    cancelled: 0,
    onhold: 0,
  },
  {
    date: "2024-10-26",
    pending: 10,
    confirmed: 0,
    processing: 0,
    printing: 0,
    finishing: 0,
    completed: 0,
    cancelled: 0,
    onhold: 0,
  },
];

const chartConfig = {
  pending: {
    label: "Pending",
    color: "var(--color-PENDING)",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--color-CONFIRMED)",
  },
  processing: {
    label: "Processing",
    color: "var(--color-PROCESSING)",
  },
  printing: {
    label: "Printing",
    color: "var(--color-PRINTING)",
  },
  finishing: {
    label: "Finishing",
    color: "var(--color-FINISHING)",
  },
  completed: {
    label: "Completed",
    color: "var(--color-COMPLETED)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--color-CANCELLED)",
  },
  onhold: {
    label: "OnHold",
    color: "var(--color-ONHOLD)",
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

interface ChartByStatusOrderProps {
  data: getByStatusOrdersToCartRes[];
}
const ChartStatusOrder = ({ data  }: ChartByStatusOrderProps) => {
  
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
    setTimeRange(localStorage.getItem("timeRange") ?? "7d");
    setRange(localStorage.getItem("chartRangeKey") ?? "7 hari terakhir");
  }, []);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Chart Pemesanan</CardTitle>
          <CardDescription>
           Menampilkan total pemesanan untuk {range} di { new Date().getFullYear() }
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(e) => {
            const select = SelectItems.find((e2) => e == e2.value);
            setTotalRange(select?.title ?? "Last 3 months");
            localStorage.setItem("timeRange", e);
            setRange(select?.title ?? "");
            localStorage.setItem("chartRangeKey", select?.title ?? "");
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
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillConfirmed" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient id="fillProcessing" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-processing)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-processing)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFinishing" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-finishing)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-finishing)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPrinting" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-printing)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-printing)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cancelled)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cancelled)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOnHold" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-onhold)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-onhold)"
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
              dataKey="confirmed"
              type="natural"
              fill="url(#fillConfirmed)"
              stroke="var(--color-confirmed)"
              stackId="a"
            />
            <Area
              dataKey="processing"
              type="natural"
              fill="url(#fillProcessing"
              stroke="var(--color-processing)"
              stackId="a"
            />
            <Area
              dataKey="printing"
              type="natural"
              fill="url(#fillPrinting)"
              stroke="var(--color-printing)"
              stackId="a"
            />
            <Area
              dataKey="finishing"
              type="natural"
              fill="url(#fillFinishing)"
              stroke="var(--color-finishing)"
              stackId="a"
            />
            <Area
              dataKey="completed"
              type="natural"
              fill="url(#fillCompleted)"
              stroke="var(--color-completed)"
              stackId="a"
            />
            <Area
              dataKey="cancelled"
              type="natural"
              fill="url(#fillCancelled)"
              stroke="var(--color-cancelled)"
              stackId="a"
            />
            <Area
              dataKey="on_hold"
              type="natural"
              fill="url(#fillOnHold)"
              stroke="var(--color-onhold)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartStatusOrder;
