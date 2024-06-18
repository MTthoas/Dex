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

export function Combobox({
  tokens,
  cryptoSelected,
  setCryptoSelected,
}: {
  tokens: any;
  cryptoSelected: any;
  setCryptoSelected: any;
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
          {cryptoSelected
            ? tokens &&
              tokens.find((token) => token.value === cryptoSelected)?.label
            : "Select crypto..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search crypto..." />
          <CommandList>
            <CommandEmpty> Select crypto </CommandEmpty>
            <CommandGroup>
              {tokens &&
                tokens.map((token) => (
                  <CommandItem
                    key={token.value}
                    value={token.value}
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
                        cryptoSelected === token.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {token.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
