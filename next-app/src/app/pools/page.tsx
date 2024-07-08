"use client";
import AddPoolModal from "@/components/liquidityPool/AddPoolModal";
import LiquidityPoolList from "@/components/liquidityPool/LiquidityPoolList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { getPools } from "@/hook/pools.hook";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Layout from "@/components/liquidityPool/Layout";

export default function Page() {
  const { data: pools } = useQuery({
    queryKey: ["pools"],
    queryFn: getPools,
  });

  // Connect pools in to doo to display in the UI

  return (
    <div className="w-full flex justify-center h-screen mb-20">
      <Layout />
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
