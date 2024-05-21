import Link from "next/link";

export default function footer() {
    return (
      <div className="flex flex-col">
        <header />
        <main className="flex-grow" />
        <footer className="p-4 text-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">GenX.Wherever</p>
              <p className="text-sm">Unlock the world of cryptocurrency trading.</p>
            </div>
            <div>
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
                  <p className="text-sm font-semibold leading-6 text-foreground">
                    <Link href={"/staking"}>Staking</Link>
                  </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
  