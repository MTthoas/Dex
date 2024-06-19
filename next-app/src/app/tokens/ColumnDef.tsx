import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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

export const columns: ColumnDef<Token>[] = [
  {
    accessorKey: "market_cap_rank",
    header: "Rank",
    cell: ({ row }) => (
      <div className="capitalize"> {row.getValue("market_cap_rank")}</div>
    ),
  },
  {
    accessorKey: "image",
    header: "Logo",
    cell: ({ row }) => (
      <div className="">
        <img
          src={row.getValue("image")}
          alt={row.getValue("name")}
          style={{ width: 25, height: 25 }}
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "current_price",
    header: "Current Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("current_price"));
      return <div>{price} $</div>;
    },
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: "Change",
    cell: ({ row }) => {
      const change = parseFloat(row.getValue("price_change_percentage_24h"));
      // const change = row.getValue("price_change_percentage_24h");
      const isPositive = change >= 0;
      const changeClass = isPositive ? "text-green-500" : "text-red-500";
      const changeSymbol = isPositive ? "▲" : "▼";
      return (
        <div className={`font-medium ${changeClass}`}>
          {changeSymbol} {change.toFixed(2)}%
        </div>
      );
    },
  },
  {
    accessorKey: "market_cap",
    header: "Market Cap",
    cell: ({ row }) => {
      const marketCap = parseFloat(row.getValue("market_cap"));
      const formattedMarketCap = formatMarketCap(marketCap);
      return <div className="">{formattedMarketCap} $</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.Id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
