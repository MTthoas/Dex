import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserByAdress,
  getUsers,
  createUser,
  CreateUserRequest,
} from "@/hook";
import { useEffect } from "react";

export default function Home() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: user, error, isError } = useQuery({
    queryKey: ["getUserByAddress", address],
    queryFn: () => getUserByAdress(address!),
    enabled: !!address,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const mutation = useMutation<
    ReturnType<typeof createUser>,
    Error,
    CreateUserRequest
  >({ mutationFn: createUser });

  useEffect(() => {
    // Déclencher la mutation si une erreur survient et aucune donnée n'est retournée
    if (!user && address && isError) {
      mutation.mutate({ address, name: "New User" });
    }
  }, [address, isError, user]);

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="flex-col items-center">
        <h1 className="text-4xl font-bold my-2">Welcome to Dex App</h1>
        {!isConnected ? (
          <Button onClick={() => open()}>Connect</Button>
        ) : (
          <Button onClick={() => disconnect()}>Disconnect</Button>
        )}
        <div>
          {isConnected && <p>Connected with {address}</p>}
          {isError && (
            <p>Error: {error.message}. User not found, creating...</p>
          )}

          <div className="mt-7">
            <h1> User information </h1>
            {user && (
              <div>
                <p>ID: {user.data.id}</p>
                <p>Name: {user.data.name}</p>
                <p>Address: {user.data.address}</p>
              </div>
            )}
          </div>

          <div className="mt-7">
            <h1> List of users registered </h1>
            {users && (
              <ul>
                {users.data.map((user: any) => (
                  <li key={user.id}>
                    {user.name} / {user.address}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
