export interface Chain {
    value: string;
    label: string;
    chainId: number;
  }
  
export interface SendCardProps {
    isConnected: boolean;
    chains: Chain[];
    balance: any;
    cryptoSelected: any;
    setCryptoSelected: any;
    account: any;
    chaindId: number;
  }
  