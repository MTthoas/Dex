"use client";

import Globe from "@/components/magicui/globe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTransactions } from "@/hook/transactions.hook";
import { getUsers } from "@/hook/users.hook";
import { Hook } from "@/types/hookResponse.type";
import { Transaction } from "@/types/transaction.type";
import { User } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";

const Page = () => {
  const { data: transactions } = useQuery<Hook<Transaction[]>>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const { data: users } = useQuery<Hook<User[]>>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const transactionData = React.useMemo(() => {
    if (!transactions || !transactions.data) return [];

    const dateMap = transactions.data.reduce(
      (acc: any, transaction: Transaction) => {
        const date = new Date(transaction.updated_at)
          .toISOString()
          .split("T")[0];
        if (!acc[date]) acc[date] = 0;
        acc[date]++;
        return acc;
      },
      {}
    );

    return Object.keys(dateMap)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        transactions: dateMap[date],
      }));
  }, [transactions]);

  const userData = React.useMemo(() => {
    if (!users || !users.data) return [];

    const dateMap = users.data.reduce((acc: any, user: User) => {
      const date = new Date(user.created_at).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    return Object.keys(dateMap)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        users: dateMap[date],
      }));
  }, [users]);

  const chartConfig = {
    transactions: {
      label: "Transactions",
      color: "hsl(var(--chart-1))",
    },
    users: {
      label: "Users",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div key="1" className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 ml-12">
          <div className="lg:col-span-2">
            <h1 className="text-7xl font-bold mb-4">
              Buy and Sell Instantly on
              <span className="text-[#bd1e59]"> GenX DEX</span>
            </h1>
            <p className="text-xl mb-8">
              Unlock the world of cryptocurrency trading. Experience the freedom
              to trade tokens instantly, no registration needed.
            </p>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
              <Card className="row-span-2 col-span-2">
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Showing the number of transactions per day
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <LineChart
                      accessibilityLayer
                      data={transactionData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <Tooltip
                        content={
                          <ChartTooltipContent
                            className="w-[150px]"
                            nameKey="transactions"
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              );
                            }}
                          />
                        }
                      />
                      <Line
                        dataKey="transactions"
                        type="monotone"
                        stroke={`var(--color-transactions)`}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="row-span-2 col-span-1">
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>New users per day</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <LineChart
                      accessibilityLayer
                      data={userData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <Tooltip
                        content={
                          <ChartTooltipContent
                            className="w-[150px]"
                            nameKey="users"
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              );
                            }}
                          />
                        }
                      />
                      <Line
                        dataKey="users"
                        type="monotone"
                        stroke={`var(--color-users)`}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden">
            <Globe className="top-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
