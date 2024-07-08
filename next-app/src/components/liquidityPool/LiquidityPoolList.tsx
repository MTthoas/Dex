"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getPools } from "@/hook/pools.hook";

export default function LiquidityPoolList() {
  // Use tanstack/react-query to fetch data from the server
  const { data: pools } = useQuery({
    queryKey: ["pools"],
    queryFn: getPools,
  });

  console.log(pools);

  const liquidityPools = [
    {
      name: "ETH/USDC",
      totalLockedVolume: "$10.2M",
      annualYield: "12.5%",
    },
    {
      name: "BTC/USDT",
      totalLockedVolume: "$8.7M",
      annualYield: "10.2%",
    },
    {
      name: "LINK/ETH",
      totalLockedVolume: "$6.4M",
      annualYield: "9.8%",
    },
    {
      name: "DAI/USDC",
      totalLockedVolume: "$5.9M",
      annualYield: "8.4%",
    },
    {
      name: "AAVE/ETH",
      totalLockedVolume: "$4.2M",
      annualYield: "7.6%",
    },
    {
      name: "UNI/ETH",
      totalLockedVolume: "$3.8M",
      annualYield: "6.9%",
    },
  ];
  return (
    <div className="flex flex-col w-full">
      <main className="bg-background text-foreground py-8">
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {pools &&
            pools.data &&
            pools.data.map((pool) => (
              <Card
                key={pool.name}
                className="bg-card text-card-foreground rounded-lg shadow-md px-6 "
              >
                <CardHeader className="border-b border-card-foreground/20 px-6 py-4">
                  <h2 className="text-xl font-bold">
                    {" "}
                    {pool.first_token_name}/{pool.second_token_name}
                  </h2>
                </CardHeader>
                <CardContent className="px-3 py-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Total Locked Volume:
                    </span>
                    <span className="text-sm">{pool.totalLockedVolume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Annual Yield:
                    </span>
                    <span>{pool.annualYield}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-card-foreground/20 px-6 py-4">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Join Pool
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
