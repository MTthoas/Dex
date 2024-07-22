export interface Chain {
    value: string;
    label: string;
    chainId: number;
  }
  
export interface SendCardProps {
    isConnected: boolean;
    chains: Chain[];
    balance: any;
    tokens: any;
    allTokens: any;
    cryptoSelected: any;
    setCryptoSelected: any;
    account: any;
    chainId: number;
    queryClient: any;
  }
  