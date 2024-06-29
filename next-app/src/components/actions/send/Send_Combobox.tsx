"use client";

import * as React from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Chain } from "../actions.type";

export function Send_Combobox({
  chains,
  cryptoSelected,
  setCryptoSelected,
  chainId,
}: {
  chains: Chain[];
  cryptoSelected: any;
  setCryptoSelected: any;
  chainId: number;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <>
            <div>
              {chains.find((chain) => chain.value === cryptoSelected)?.label}
              {chainId !==
              chains.find((chain) => chain.value === cryptoSelected)
                ?.chainId ? (
                <span className="text-xs bg-red-500 text-white rounded-full h-2 w-2 inline-block ml-2">
                  {" "}
                </span>
              ) : (
                <span className="text-xs bg-green-500 text-red-500 rounded-full h-2 w-2 inline-block ml-2">
                  {" "}
                </span>
              )}
            </div>
          </>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search crypto..." />
          <CommandList>
            <CommandEmpty> Select crypto </CommandEmpty>
            <CommandGroup>
              {chains &&
                chains.map((chain) => (
                  <CommandItem
                    key={chain.value}
                    value={chain.value}
                    onSelect={(currentValue) => {
                      setCryptoSelected(
                        currentValue === cryptoSelected ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        cryptoSelected === chain.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {chain.label}
                    <div className="pl-3">
                      {chainId !== chain.chainId ? (
                        <span className="text-xs bg-red-500 text-white rounded-full h-2 w-2 inline-block">
                          {" "}
                        </span>
                      ) : (
                        <span className="text-xs bg-green-500 text-red-500 rounded-full h-2 w-2 inline-block">
                          {" "}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
