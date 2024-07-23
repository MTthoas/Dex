"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCoins } from "@/hook/coins.hook";
import { getTokens } from "@/hook/tokens.hook";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { columns as tokenColumns } from "./ColumnDef";
import { ethereumColumns } from "./ColumnDefEthereum";
import { Token } from "./token.model";

function formatMarketCap(value: number) {
  let formattedValue;
  if (value >= 1e9) {
    formattedValue = `${(value / 1e9).toFixed(2)} B`;
  } else if (value >= 1e6) {
    formattedValue = `${(value / 1e6).toFixed(2)} M`;
  } else {
    formattedValue = value.toFixed(2);
  }
  return formattedValue;
}

export default function TokenPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const {
    data: tokens,
    isLoading: isLoadingTokens,
    isError: isErrorTokens,
  } = useQuery<Token[]>({
    queryKey: ["tokens"],
    queryFn: getTokens,
    placeholderData: [],
  });

  const {
    data: coins,
    isLoading: isLoadingCoins,
    isError: isErrorCoins,
  } = useQuery<Token[]>({
    queryKey: ["coins"],
    queryFn: getCoins,
    placeholderData: [],
  });

  console.log("coins", coins);

  const ethereumCoins = useMemo(() => {
    return coins?.slice(0, 10) ?? [];
  }, [coins]);

  console.log("ethereumCoins", ethereumCoins);

  const tokenTable = useReactTable({
    data: tokens ?? [],
    columns: tokenColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const ethereumTable = useReactTable({
    data: ethereumCoins,
    columns: ethereumColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoadingTokens || isLoadingCoins) {
    return <div>Loading...</div>;
  }

  if (isErrorTokens || isErrorCoins) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="container min-h-screen pb-12">
      <div className="mx-auto xl:mx-14">
        <div className="w-full mt-7">
          <h1 className="text-3xl font-semibold">List of tokens</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Each token has a unique ID and can be used to access the Genx API.
          </p>
        </div>

        <div className="flex items-center pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tokenTable.getAllColumns().map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-lg border mb-10">
          <Table>
            <TableHeader>
              {tokenTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoadingTokens
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                : tokenTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        <div className="w-full mt-20">
          <h1 className="text-3xl font-semibold">List of Ethereum Coins</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Each token has a unique ID and can be used to access the Genx API.
          </p>
        </div>

        <div className="flex items-center pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {ethereumTable.getAllColumns().map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {ethereumTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {ethereumTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
