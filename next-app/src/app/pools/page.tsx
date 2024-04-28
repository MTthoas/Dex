"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getPools } from "@/hook/pools.hook";
import { Plus } from "lucide-react";

export default function page() {
  const { data: pools } = useQuery({
    queryKey: ["pools"],
    queryFn: getPools,
  });

  // Connect pools in to doo

  return (
    <div className="w-full flex justify-center h-screen ">
      <div className="w-2/3">
        <div className="my-12 flex space-between ">
          <h1 className="text-3xl font-semibold"> List of pools</h1>
          <Button size="lg" className="h-8 gap-1 ml-auto">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Pool
            </span>
          </Button>
        </div>
        <div className="grid grid-row gap-4">
          <PoolItem name="Pool 1" earned="0.01" apr="0.01" liquidity="0.01" />
          <PoolItem name="Pool 2" earned="0.02" apr="0.02" liquidity="0.02" />
          <PoolItem name="Pool 3" earned="0.03" apr="0.03" liquidity="0.03" />
        </div>
      </div>
    </div>
  );
}

const PoolItem = ({
  name,
  earned,
  apr,
  liquidity,
}: {
  name: string;
  earned: string;
  apr: string;
  liquidity: string;
}) => {
  return (
    <Card>
      <CardHeader>{name}</CardHeader>
      <CardContent>
        <CardDescription>Earned {earned}</CardDescription>
        <CardDescription>APR {apr}</CardDescription>
        <CardDescription>Liquidity {liquidity}</CardDescription>
      </CardContent>
    </Card>
  );
};
