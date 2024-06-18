"use client";

import { NavLink } from "@/types/header.type";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";

const HeaderLinks: NavLink[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Tokens",
    href: "/tokens",
  },
  {
    name: "Actions",
    href: "/actions",
  },
  {
    name: "Stake",
    href: "/staking",
  },
  {
    name: "Pools",
    href: "/pools",
  },
];

export default function Header(): JSX.Element {
  const { address } = useAccount();
  return (
    <header className="dark">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8 mt-5"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-5 ">GenX</span>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 pt-1 mr-24 pr-12">
          {HeaderLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="
                text-sm
                font-medium
                hover:text-gray-500"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end pt-1 w-1/3">
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
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

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
                    }

                    if (chain.unsupported) {
                      return (
                        <Button onClick={openChainModal}>Wrong network</Button>
                      );
                    }

                    return (
                      <div style={{ display: "flex", gap: 12 }}>
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
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </Button>

                        <Button onClick={openAccountModal} type="button">
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

          {/* If the user is connected, show the account button */}
          {address && (
            <Link href="/profil">
              <Button className="ml-2">
                <UserRound size={16} className="mr-2" />
                Account
              </Button>
            </Link>
          )}
          <div className="ml-2">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
