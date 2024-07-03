"use client";

import { BarChart } from "@/components/Charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const TotalLiquidityGraph = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Liquidity</CardTitle>
        <CardDescription>
          The total liquidity across all token pairs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart className="aspect-[9/4]" />
      </CardContent>
    </Card>
  );
};

export default TotalLiquidityGraph;
