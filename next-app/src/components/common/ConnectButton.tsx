"use client";

import { useEffect, useState } from "react";
import { createUser } from "@/hook/users.hook";
import {
  useReadUserRegistryIsUserBanned,
  useReadUserRegistryIsRegisteredUser,
  useWriteUserRegistryRegisterUser,
} from "@/hook/WagmiGenerated";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CustomConnectButtonProps {
  showChainModal?: boolean;
  showAccountModal?: boolean;
  showError?: boolean;
}

export const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({
  showChainModal = true,
  showAccountModal = true,
  showError = true,
}) => {
  const { address } = useAccount();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: isUserBanned,
    error: userBannedError,
    isLoading: userBannedIsLoading,
    isSuccess: userBannedIsSuccess,
    isError: userBannedIsError,
  } = useReadUserRegistryIsUserBanned({
    args: address ? [address] : undefined,
  });
  const {
    data: isRegisteredUser,
    error: registeredUserError,
    isLoading: registeredUserIsLoading,
    isSuccess: registeredUserIsSuccess,
    isError: registeredUserIsError,
  } = useReadUserRegistryIsRegisteredUser({
    args: address ? [address] : undefined,
  });
  const { writeContractAsync: registerUser, error: registerUserError } =
    useWriteUserRegistryRegisterUser();

  useEffect(() => {
    if (address) {
      const checkUserStatus = async () => {
        try {
          if (userBannedError || registeredUserError) {
            throw new Error("Error checking user status.");
          }

          if (
            userBannedIsLoading ||
            registeredUserIsLoading ||
            !userBannedIsSuccess ||
            !registeredUserIsSuccess
          ) {
            return;
          }

          setIsBanned(!!isUserBanned);
          setIsRegistered(!!isRegisteredUser);

          if (!isUserBanned && !isRegisteredUser) {
            const randomName = "User" + Math.floor(Math.random() * 1000);
            await registerUser({ args: [randomName] }).then((hash) => {
              console.log("User registered with hash:", hash);
            });
            await createUser({ address: address.toLowerCase(), name: randomName });
          }
        } catch (error: any) {
          setError(error.message);
          console.error("Error registering user:", error);
        }
      };

      checkUserStatus();
    }
  }, [
    address,
    isRegisteredUser,
    isUserBanned,
    registerUser,
    userBannedError,
    registeredUserError,
    userBannedIsLoading,
    registeredUserIsLoading,
    userBannedIsSuccess,
    registeredUserIsSuccess,
  ]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="secondary">
                    Connect Wallet
                  </Button>
                );
              } else if (error) {
                return showError ? (
                  <div className="text-red-500">Error: {error}</div>
                ) : null;
              } else {
                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    {showChainModal && (
                      <Button
                        onClick={openChainModal}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        type="button"
                        variant="ghost"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <Image
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                height={12}
                                width={12}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>
                    )}

                    {showAccountModal && (
                      <Button onClick={openAccountModal} type="button">
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </Button>
                    )}
                  </div>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
