"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
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
import { useAccount, useReadContract } from "wagmi";
import { abi } from "../../abi/Token.json";
import { ethers } from "ethers";
import { useWriteContract } from 'wagmi'
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Token } from "./token.model";
import axios from "axios";
import { columns } from "./ColumnDef";

const contractConfig = {
  address: "0xcF8fB3da3f2E622D14f8a61d2D7361B7f94E75eB",
  abi: abi,
} as const;

export default function TokenPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [amountToBuy, setAmountToBuy] = React.useState('');

  const [data, setData] = React.useState<Token[]>([]);

  const { data: balance } = useReadContract({
    ...contractConfig,
    args: [useAccount().address],
    functionName: "balanceOf",
  });
  
  const { data: totalSupply } = useReadContract({
    ...contractConfig,
    functionName: "totalSupply",
  });

  const walletUser = useAccount().address;
  
  const { writeContract } = useWriteContract();

  console.log("TotalSupply :", totalSupply);
  console.log("Balance of :", balance);

  React.useEffect(() => {
    axios
      .get("http://localhost:5002/api/v1/coins", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const indexedData = response.data.map((item: any, index: any): any => ({
          ...item,
          index: index + 1,
        }));
        setData(indexedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const table = useReactTable({
    data,
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
  });

  return (
    <div className="w-full flex justify-center ">
      <div className="w-2/3">
        <div className="my-12">
          <h1 className="text-3xl font-semibold">
            {" "}
            List of tokens on Ethereum
          </h1>
          <p className="text-sm text-muted-foreground">
            Each token has a unique ID and can be used to access the Genx API.
          </p>
        </div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
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
        <div className="rounded-lg border">
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
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={index}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, indexCell) => (
                      <TableCell key={indexCell}>
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
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
          </div>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2 py-4">
          <Input
            type="number"
            min="0"
            placeholder="Amount in ETH to buy tokens"
            value={amountToBuy}
            onChange={(e) => setAmountToBuy(e.target.value)}
            className="max-w-sm"
          />
          <Button
            onClick={() => 
              writeContract({ 
                abi,
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                functionName: 'buyToken',
                args: [
                  walletUser,
                  '0x6b175474e89094c44da98b954eedeac495271d0f',
                  123,
                ],
             })
            }
          >
            Buy Our Token
          </Button>
        </div>
      </div>
    </div>
  );
}
