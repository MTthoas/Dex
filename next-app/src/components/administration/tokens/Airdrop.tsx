"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryClient } from "@/context";
import { createToken, deleteToken, getTokens } from "@/hook/tokens.hook";
import { useFetchTokensPairsByAddressList } from "@/hook/useFetchTokenPairs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";

export type Token = {
  id: string;
  name: string;
  address: string;
  symbol: string;
};

const SkeletonList = () => {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
};

const Airdrop = () => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [symbol, setSymbol] = React.useState("");
  const [supply, setSupply] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { chainId } = useAccount();

  // Always call hooks at the top level
  const { data: listOfAddress } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
    address: liquidityFactoryAddress,
    chainId,
  });

  const { pairs, allTokens } = useFetchTokensPairsByAddressList(
    listOfAddress,
    chainId
  );

  console.log(allTokens);

  const allTokenAddresses = allTokens.map((token) => token.address);

  const columns: ColumnDef<Token>[] = [
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const token = row.original;
        const deleteMutation = useMutation({
          mutationFn: deleteToken,
          onSuccess: () => {
            queryClient.invalidateQueries(["tokens"]);
            toast.success("Token deleted successfully!");
          },
        });

        if (allTokenAddresses.includes(token.address)) {
          return null;
        }

        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteMutation.mutate(token.id)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const mutation = useMutation({
    mutationFn: createToken,
    onSuccess: () => {
      queryClient.invalidateQueries(["tokens"]);
      toast.success("Token created successfully!");
      setName("");
      setSymbol("");
      setAddress("");
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`Error creating token: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleCreateToken = () => {
    setIsSubmitting(true);
    mutation.mutate({
      name,
      symbol,
      address,
      max_supply: supply,
      total_supply: supply,
    });
  };

  const {
    data: tokensFetch = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: getTokens,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: tokensFetch,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: { pagination: { pageSize: 4 } },
  });

  return (
    <div className="w-full">
      <div className="flex mb-4">
        <div className="w-1/3 pr-5">
          <Card>
            <CardHeader>
              <CardTitle>Add Token</CardTitle>
              <CardDescription>Add a token to our DAPP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full mb-2"
                  placeholder="Enter name of the token"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  type="text"
                  className="w-full mb-2"
                  placeholder="Enter token SYMBOL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                />
                <Label htmlFor="address">Token Address</Label>
                <Input
                  id="address"
                  type="text"
                  className="w-full"
                  placeholder="Enter address of the token"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <Label htmlFor="address">Supply</Label>
                <Input
                  id="address"
                  type="text"
                  className="w-full"
                  placeholder="Enter supply of the token"
                  value={supply}
                  onChange={(e) => setSupply(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateToken} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Add Token"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-2/3">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter tokens..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <SkeletonList />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
