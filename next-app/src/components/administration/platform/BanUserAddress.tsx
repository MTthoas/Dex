"use client";
import { useState } from "react";
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

const BanUserAddress = () => {
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Ban User</CardTitle>
          <CardDescription>
            Enter the user&apos;s address to ban them from the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter user's address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>Ban User</Button>
        </CardFooter>
      </Card>
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-xs p-6 text-center">
            <CardContent>
              <CircleCheckIcon className="mx-auto mb-4 h-8 w-8 text-green-500" />
              <p className="font-medium">User has been banned successfully!</p>
              <p className="font-light mt-2">
                {address.slice(0, 5)}
                ...
                {address.slice(address.length - 5, address.length)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default BanUserAddress;
