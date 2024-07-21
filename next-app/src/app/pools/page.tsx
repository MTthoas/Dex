"use client";
import Layout from "@/components/liquidityPool/Layout";
import { getPools } from "@/hook/pools.hook";
import { getTokens } from "@/hook/tokens.hook";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  return (
    <div className="container min-h-screen py-32">
      <div className="mx-auto xl:mx-14">
        {" "}
        <Layout />
      </div>
    </div>
  );
}
