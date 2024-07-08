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
// Connect pools in to doo to display in the UI

export default function Layout() {
  return (
    <div className="w-screen flex h-screen mb-20 mx-12">
      <div className="w-full">
        <div className="my-12 flex space-between">
          <h1 className="text-3xl font-semibold"> List of pools</h1>
          <Button size="lg" className="h-8 gap-1 ml-auto">
            <Plus className="h-3.5 w-3.5" />
            <AddPoolModal />
          </Button>
        </div>
        <div className="grid grid-row gap-4">
          <LiquidityPoolList />
        </div>
      </div>
    </div>
  );
}
