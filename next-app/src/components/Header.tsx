"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUserByAdress, getUsers, createUser, CreateUserRequest } from "@/hook";

export default function EnhancedHeader() {
  const { open, isConnected, address, isConnecting, isDisconnected } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    data: user,
    isError: isErrorToGetUser,
  } = useQuery({
    queryKey: ["getUserByAddress", address],
    queryFn: () => getUserByAdress(address!),
    enabled: !!address,
  });

  const mutation = useMutation<ReturnType<typeof createUser>, Error, CreateUserRequest>({
    mutationFn: createUser
  });

  return (
    <header className="dark">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8 mt-5"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 p-1.5 text-lg font-semibold leading-5 text-white"
          >
            GenX
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 pt-2">
          <Link href="/swap" className="text-sm font-semibold leading-6 text-white">Swap</Link>
          <Link href="/dashboard" className="text-sm font-semibold leading-6 text-white">Dashboard</Link>
          <Link href="/tokens" className="text-sm font-semibold leading-6 text-white">Tokens</Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end pt-1">
          {!isConnected && (
            <Button variant="outline" onClick={() => open()} type="button">
              Connect to wallet
            </Button>
          )}
          {isConnected && (
            <>
              <Button variant="outline" onClick={disconnect} type="button">
                Disconnect
              </Button>
              <Button variant="outline" onClick={() => {}} type="button">
                {formatAddress(address)}
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
