"use client";

import { CircleCheckIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserByAdress, updateUser } from "@/hook/users.hook";
import { useWriteUserRegistryBanUser } from "@/hook/WagmiGenerated";
import { useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

const BanUserAddress = () => {
  const { address } = useAccount();
  const { writeContractAsync: writeUserRegistryBanUser } =
    useWriteUserRegistryBanUser();
  const [addressToBan, setAddressToBan] = useState<Address | string>("");
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveChanges = async () => {
    setShowError(null);
    setIsUpdating(true);
    if (address && addressToBan) {
      if (address.toLowerCase() !== addressToBan.toLowerCase()) {
        try {
          console.log("Banning user with address:", addressToBan);
          const user = await getUserByAdress(addressToBan.toLowerCase());
          if (!user.data) {
            throw new Error("User not found");
          }
          await writeUserRegistryBanUser({
            args: [addressToBan as Address],
          }).then(async (hash) => {
            console.log("User banned with hash:", hash);

            console.log("Banning user id:", user.data.id);
            await updateUser(user.data.id, { banned: "true" });

            setShowConfirmation(addressToBan as string);
            setTimeout(() => setShowConfirmation(null), 3000);
          });
        } catch (writeError: any) {
          console.error("Failed to ban user:", writeError);
          setShowError(writeError.message);
          setTimeout(() => setShowError(null), 3000);
        } finally {
          setIsUpdating(false);
        }
      } else {
        setShowError("You cannot ban yourself");
        setTimeout(() => setShowError(null), 3000);
        setIsUpdating(false);
      }
    } else {
      setShowError("Please enter a valid address");
      setTimeout(() => setShowError(null), 3000);
      setIsUpdating(false);
    }
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
              placeholder="0x1234..."
              value={addressToBan}
              onChange={(e) => setAddressToBan(e.target.value)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-xs p-6 text-center">
            <CardContent>
              <CircleCheckIcon className="mx-auto mb-4 h-8 w-8 text-green-500" />
              <p className="font-medium">User has been banned successfully!</p>
              <p className="font-light mt-2">
                {addressToBan.slice(0, 5)}
                ...
                {addressToBan.slice(
                  addressToBan.length - 5,
                  addressToBan.length
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {showError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-xs p-6 text-center">
            <CardContent>
              <p className="font-medium text-red-500">Error: {showError}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BanUserAddress;
