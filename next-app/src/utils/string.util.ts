export function formatAddress(address: string): string {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  }
  