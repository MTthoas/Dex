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
    accessorKey: "max_supply",
    header: "Max Supply",
    cell: (info) => formatBigNumber(info.getValue()),
  },
  {
    accessorKey: "total_supply",
    header: "Total Supply",
    cell: (info) => formatBigNumber(info.getValue()),
  },
];

function formatBigNumber(value: number) {
  if (value === null || value === undefined) {
    return "-";
  }

  value = String(value);
  value = ethers.formatEther(value);

  if (value >= 1e15) {
    return `${(value / 1e15).toFixed(2)} Q $`; // Quadrillions
  } else if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)} T $`; // Trillions
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)} B $`; // Billions
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)} M $`; // Millions
  } else {
    return value.toFixed(2); // Small values
  }
}
