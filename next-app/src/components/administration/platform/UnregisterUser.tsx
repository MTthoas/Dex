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
import { deleteUser, getUserByAdress, getUsers } from "@/hook/users.hook";
import { useWriteUserRegistryUnregisterUser } from "@/hook/WagmiGenerated";
import { User } from "@/types/user.type";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

const UnregisterUser = () => {
  const { address } = useAccount();
  const {
    writeContractAsync: writeUserRegistryUnregisterUser,
    data,
    isPending,
    error,
    isSuccess,
    isError,
  } = useWriteUserRegistryUnregisterUser();
  const [users, setUsers] = useState<Array<User>>([]);
  const [addressToUnregister, setAddressToUnregister] = useState<
    Address | string
  >("");
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching banned users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSaveChanges = async () => {
    setShowError(null);
    setIsUpdating(true);
    if (address && addressToUnregister) {
      try {
        console.log(
          "Unregister user with address:",
          addressToUnregister.toLowerCase()
        );
        const user = await getUserByAdress(addressToUnregister.toLowerCase());
        if (!user.data) {
          throw new Error("User not found");
        }
        await writeUserRegistryUnregisterUser({
          args: [addressToUnregister as Address],
        }).then(async (hash) => {
          console.log("User unregistered with hash:", hash);
          await deleteUser(user.data.id);

          setShowConfirmation(addressToUnregister.toLowerCase());
          setTimeout(() => setShowConfirmation(null), 3000);
          setUsers((prev) =>
            prev.filter(
              (u) =>
                u.address.toLowerCase() !== addressToUnregister.toLowerCase()
            )
          );
        });
      } catch (writeError: any) {
        console.error("Failed to unregister user:", writeError);
        setShowError(writeError.message);
        setTimeout(() => setShowError(null), 3000);
      } finally {
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
          <CardTitle>Unregister a User</CardTitle>
          <CardDescription>
            Select the user&apos;s address to unregister them from the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Select
              onValueChange={setAddressToUnregister}
              disabled={isUpdating}
            >
              <SelectTrigger id="address">
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
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
                User has been unregistered successfully!
              </p>
              <p className="font-light mt-2">
                {addressToUnregister.slice(0, 5)}
                ...
                {addressToUnregister.slice(
                  addressToUnregister.length - 5,
                  addressToUnregister.length
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

export default UnregisterUser;
