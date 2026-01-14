"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Chart } from "../queries";


const chartConfig = {
  revenue: { label: "Pendapatan Kotor: ", color: "var(--chart-1)" },
  orders: { label: "Pemesanan: ", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface DashboardChartProps {
  data: Chart[];
}
const DashboardChart = ({ data }: DashboardChartProps) => {
  const [timeRange, setTimeRange] = useState<string>("");
  const [range, setRange] = useState<string>("");

  useEffect(() => {
    setTimeRange(localStorage.getItem("timeRangeDashboard") ?? "7d");
    setRange(localStorage.getItem("chartRangeDashboardKey") ?? "7 hari terakhir");
  }, []);

  return (
    <div className="grid mt-1 md:mt-5 p-0">
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle> Pendapatan & Pesanan</CardTitle>
            <CardDescription>
              Grafik Pendapatan & Pesanan Penjualan selema {range} di tahun{" "}
              {new Date().getFullYear()}
            </CardDescription>
          </div>
          <Select
            value={timeRange}
            onValueChange={(e) => {
              setTimeRange(e);
              localStorage.setItem("timeRangeDashboard", e);
              const rangeValues: Record<string, string> = {
                "7d": "7 hari terakhir",
                "30d": "30 hari terakhir",
                "90d": "3 bulan terakhir",
              };
              setRange(rangeValues[e]);
              localStorage.setItem("chartRangeDashboardKey", rangeValues[e]);
            }}
          >
            <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                7 hari terakhir
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 hari terakhir
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                3 bulan terakhir
              </SelectItem>
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
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-orders)"
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
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="url(#fillOrders)"
                stroke="var(--color-orders)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardChart;
