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
import { getTokens } from "@/hook/tokens.hook";

export default function Page() {
  // Connect pools in to doo to display in the UI

  const { data: tokens } = useQuery({
    queryKey: ["tokens"],
    queryFn: getTokens,
  });

  // Use tanstack/react-query to fetch data from the server
  const { data: pools } = useQuery({
    queryKey: ["pools"],
    queryFn: getPools,
  });

  console.log(pools);

  return (
    <div className="w-full flex justify-center h-screen mb-20">
      <Layout tokens />
    </div>
  );
}
