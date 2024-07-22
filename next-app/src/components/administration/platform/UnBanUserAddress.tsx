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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserByAdress, getUsersBanned, updateUser } from "@/hook/users.hook";
import { useWriteUserRegistryUnbanUser } from "@/hook/WagmiGenerated";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

const UnBanUserAddress = () => {
  const { address } = useAccount();
  const {
    writeContractAsync: writeUserRegistryUnbanUser,
    data,
    isPending,
    error,
    isSuccess,
    isError,
  } = useWriteUserRegistryUnbanUser();
  const [bannedUsers, setBannedUsers] = useState<
    Array<{ address: string; id: number }>
  >([]);
  const [addressToUnban, setAddressToUnban] = useState<Address | string>("");
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchBannedUsers = async () => {
      try {
        const response = await getUsersBanned();
        // Filter out users that are not banned (temporary fix since the API doesn't want me to get only banned users...)
        const bannedUsers = response.data.filter(
          (user: any) => user.banned === "true"
        );
        setBannedUsers(bannedUsers);
      } catch (error) {
        console.error("Error fetching banned users:", error);
      }
    };

    fetchBannedUsers();
  }, []);

  const handleSaveChanges = async () => {
    setShowError(null);
    setIsUpdating(true);
    if (address && addressToUnban) {
      if (address.toLowerCase() !== addressToUnban.toLowerCase()) {
        try {
          console.log(
            "Unbanning user with address:",
            addressToUnban.toLowerCase()
          );
          const user = await getUserByAdress(addressToUnban.toLowerCase());
          if (!user.data) {
            throw new Error("User not found");
          }
          await writeUserRegistryUnbanUser({
            args: [addressToUnban as Address],
          }).then(async (hash) => {
            console.log("User unbanned with hash:", hash);

            console.log("Unbanning user id:", user.data.id);
            await updateUser(user.data.id, { banned: "false" });

            setShowConfirmation(addressToUnban.toLowerCase());
            setTimeout(() => setShowConfirmation(null), 3000);
            setBannedUsers((prev) =>
              prev.filter(
                (u) => u.address.toLowerCase() !== addressToUnban.toLowerCase()
              )
            );
          });
        } catch (writeError: any) {
          console.error("Failed to unban user:", writeError);
          setShowError(writeError.message);
          setTimeout(() => setShowError(null), 3000);
        } finally {
          setIsUpdating(false);
        }
      } else {
        setShowError("You cannot unban yourself");
        setTimeout(() => setShowError(null), 3000);
        setIsUpdating(false);
      }
    } else {
      setShowError("Please select a valid address");
      setTimeout(() => setShowError(null), 3000);
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Unban a User</CardTitle>
          <CardDescription>
            Select the user&apos;s address to unban them from the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Select onValueChange={setAddressToUnban} disabled={isUpdating}>
              <SelectTrigger id="address">
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {bannedUsers.map((user) => (
                  <SelectItem key={user.id} value={user.address}>
                    {user.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <p className="font-medium">
                User has been unbanned successfully!
              </p>
              <p className="font-light mt-2">
                {addressToUnban.slice(0, 5)}
                ...
                {addressToUnban.slice(
                  addressToUnban.length - 5,
                  addressToUnban.length
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

export default UnBanUserAddress;
