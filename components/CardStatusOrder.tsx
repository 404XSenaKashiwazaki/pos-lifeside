import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { ByStatusOrdersToCard } from "@/app/laporan/queries";

interface CardStatusOrderProps {
  data: ByStatusOrdersToCard[];
}
const CardStatusOrder = ({ data }: CardStatusOrderProps) => {
  return (
    <div className="mb-2 flex flex-col md:flex-row gap-2 md:justify-between">
      {data.map((e) => (
        <div key={e.status}>
          <Card className="p-3 w-full sm:max-w-[200px] shadow-sm border rounded-xl">
            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground">{e.status}</div>
              <div className="text-xl font-semibold">{e.countCurrentMonth}</div>
              <div
                className={`flex items-center gap-1 text-xs ${
                  e.percent >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {e.percent >= 0 ? (
                  <IconTrendingUp className="size-3" />
                ) : (
                  <IconTrendingDown className="size-3" />
                )}
                {e.percent >= 0 ? "+" : ""}
                {e.percent}%
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CardStatusOrder;
