import { ContractsOwnerAddress } from "@/abi/address";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/administration")) {
    const address = wagmiStore(req);
    if (address.toLowerCase() !== ContractsOwnerAddress.toLowerCase()) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/profil")) {
    const address = wagmiStore(req);
    if (!address) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/administration/:path*", "/profil"],
};


function wagmiStore(req: NextRequest) {
  const wagmiCookie = req.cookies.get("wagmi.store");
  let address;

  if (wagmiCookie?.value) {
    const connections = JSON.parse(wagmiCookie.value).state.connections.value;
    if (Array.isArray(connections) && connections.length > 0) {
      address = connections[0][1].accounts[0]; // first element of the array is always the current account used
    }
  }

  return address;
}