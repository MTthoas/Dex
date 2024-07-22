"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const Contracts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Management</CardTitle>
        <CardDescription>
          View and manage the smart contract balance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <label htmlFor="balance" className="block text-sm font-medium">
            Contract Balance
          </label>
          <Input
            id="balance"
            type="text"
            defaultValue="$2,500,000"
            disabled
            className="w-full"
          />
          <form>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                step="100"
                placeholder="Deposit amount"
                className="flex-1"
              />
              <Button type="submit">Deposit</Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contracts;
