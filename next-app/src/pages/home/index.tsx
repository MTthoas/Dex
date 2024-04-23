"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserByAdress,
  getUsers,
  createUser,
  CreateUserRequest,
} from "@/hook";
import { useEffect } from "react";

export default function Home() {
  const { open } = useWeb3Modal();
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    data: getUserByAddress,
    status,
    isError: isErrorToGetUserByAddress,
  } = useQuery({
    queryKey: ["getUserByAddress", address],
    queryFn: () => getUserByAdress(address!),
    enabled: !!address,
  });

  console.log(getUserByAddress);
  const mutation = useMutation<
    ReturnType<typeof createUser>,
    Error,
    CreateUserRequest
  >({ mutationFn: createUser });

  useEffect(() => {
    if (getUserByAddress && address && !isErrorToGetUserByAddress) {
      mutation.mutate({ address, name: "New User" }); // Adjust "New User" as necessary
    }
  }, [isConnected]);

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="flex-col items-center">
        <h1 className="text-4xl font-bold my-2">Welcome to Dex App</h1>

        {!isConnected && <Button onClick={() => open()}>Connect me</Button>}
        {isConnected && (
          <Button onClick={() => disconnect()}> Disconnect </Button>
        )}

        {isConnecting && <p>Connecting...</p>}
        {isDisconnected && <p>Disconnected</p>}
        {address && <p>Connected with {address}</p>}
      </div>
      <div className="mt-8">List of user registered</div>
      {users && (
        <ul>
          {users.data.map((user: any) => (
            <li key={user.id}>
              {user.name} / {user.address}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">User information</div>
      {isErrorToGetUserByAddress && <p> User not found </p>}
      {getUserByAddress && (
        <div>
          <p>ID : {getUserByAddress.data.id}</p>
          <p>Name: {getUserByAddress.data.name}</p>
          <p>Address : {getUserByAddress.data.address}</p>
          <p>created_at : {getUserByAddress.data.created_at} </p>
        </div>
      )}
    </div>
  );
}
