import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export default function StatsCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{value}</CardDescription>
      </CardHeader>
    </Card>
  );
}
