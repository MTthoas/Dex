"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Header() {
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
        <div className="hidden lg:flex lg:gap-x-12 pt-2">
          <p className="text-sm font-semibold leading-6 text-foreground">
            <Link href={"/swap"}>Swap</Link>
          </p>

          <p className="text-sm font-semibold leading-6 text-foreground">
            <Link href={"/dashboard"}>Dashboard</Link>
          </p>
          <p className="text-sm font-semibold leading-6 text-foreground">
            <Link href={"/tokens"}>Tokens</Link>
          </p>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end pt-1">
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
