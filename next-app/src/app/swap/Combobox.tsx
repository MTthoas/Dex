"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const tokens = [
  {
    value: "ethereum",
    label: "ETH",
    image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    width : 20,
    height : 20
  },
  {
    value: "binance-smart-chain",
    label: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    width : 20,
    height : 20

  },
  {
    value: "arbitrum",
    label: "ARB",
    image: "https://app.nfts2me.com/assets/chainlist/arbitrum.png",
    width : 20,
    height : 20
  }
]

export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("ethereum")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? tokens.find((token) => token.value === value)?.label && (
                <div className="flex items-center">
                  <img
                    src={tokens.find((token) => token.value === value)?.image}
                    alt={tokens.find((token) => token.value === value)?.label}
                    className="w-5 h-5 mr-3"
                  />
                  <p className="my-1">
                    {tokens.find((token) => token.value === value)?.label}
                  </p>
                </div>
              )
            : "Select token..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
            <CommandInput placeholder="Search token..." className="h-9" />
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
            {tokens.map((token) => (
                <CommandItem
                    key={token.value}
                    value={token.value}
                    onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                }}>
                <div className="flex items-center">
                <img src={token.image} alt={token.label} style={{ width: token.width, height: token.height }} className="mr-3"/>
                        <p className="my-1"> {token.label} </p>
                        <CheckIcon
                        className={cn(
                            "ml-3 h-4 w-4",
                            value === token.value ? "opacity-100" : "opacity-0"
                        )}/>
                </div>
                </CommandItem>
            ))}
            </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}