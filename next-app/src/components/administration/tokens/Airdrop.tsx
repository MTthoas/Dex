import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CircleCheckIcon } from "@/components/Icons";

const Airdrop = () => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleSaveChanges = () => {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/g;
    if (!addressRegex.test(address)) {
      setError("Please enter a valid address.");
      return;
    }
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
    setTimeout(() => setAddress(""), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donate Tokens</CardTitle>
        <CardDescription>Distribute free tokens to your users.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Recipient Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter user's address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={error ? "border-red-500" : ""}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount of tokens"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} className="ml-auto">
          Donate Tokens
        </Button>
      </CardFooter>
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-xs p-6 text-center">
            <CardContent>
              <CircleCheckIcon className="mx-auto mb-4 h-8 w-8 text-green-500" />
              <p className="font-medium">Tokens Donated Successfully!</p>
              <p className="font-light mt-2">
                {address.slice(0, 5)}
                ...
                {address.slice(address.length - 5, address.length)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default Airdrop;
