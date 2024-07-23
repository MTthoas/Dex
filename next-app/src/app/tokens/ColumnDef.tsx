import { ethers } from "ethers";

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "current_price",
    header: "Price",
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "market_cap",
    header: "Market Cap",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "market_cap_change_24h",
    header: "Market Cap Change 24h",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "market_cap_change_percentage_24h",
    header: "Market Cap Change Percentage 24h",
  },
  {
    accessorKey: "market_cap_rank",
    header: "Market Cap Rank",
  },
  {
    accessorKey: "max_supply",
    header: "Max Supply",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "price_change_24h",
    header: "Price Change 24h",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: "Price Change Percentage 24h",
  },
  {
    accessorKey: "total_supply",
    header: "Total Supply",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "total_volume",
    header: "Total Volume",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
  },
];

function formatBigNumber(value: number) {
  if (value === null || value === undefined) {
    return "-";
  }

  console.log(value.toString());

  value = Number(ethers.parseUnits(value, 18));

  if (value >= 1e15) {
    return `${(value / 1e15).toFixed(2)} Q`; // Quadrillions
  } else if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)} T`; // Trillions
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)} B`; // Billions
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)} M`; // Millions
  } else {
    return value.toFixed(2); // Small values
  }
}
