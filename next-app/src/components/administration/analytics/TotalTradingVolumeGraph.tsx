"use client";

import { TimeseriesChart } from "@/components/Charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const TotalTradingVolumeGraph = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Trading Volume</CardTitle>
        <CardDescription>
          The total trading volume across all tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TimeseriesChart className="aspect-[9/4]" />
      </CardContent>
    </Card>
  );
};

export default TotalTradingVolumeGraph;
