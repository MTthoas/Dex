import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="dark">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8 mt-5"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
              <div className="flex flex-col">
                <span className="text-lg font-semibold leading-5 text-white">
                  Genx
                </span>
              </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
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
          {/* <div className="relative">
                    <button type="button" className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900" aria-expanded="false">
                    Lorem
                    <svg className="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                    </button>

                </div> */}

            <p className="text-sm font-semibold leading-6 text-white">
                <NavLink to={"/swapPage"}>Swap</NavLink>
            </p>

            <p className="text-sm font-semibold leading-6 text-white">
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
            </p>
            <p className="text-sm font-semibold leading-6 text-white">
                <NavLink to={"/tokens"}>Pools</NavLink>
            </p>
            <p className="text-sm font-semibold leading-6 text-white">
                <NavLink to={"/tokens"}>Tokens</NavLink>
          </p>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button variant="outline" className="text-sm font-semibold leading-6 bg-default text-white hover:bg-primary/90">
                Connect to wallet
            </Button>
        </div>
      </nav>
    </header>
  );
}