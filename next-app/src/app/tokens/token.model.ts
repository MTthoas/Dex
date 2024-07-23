export type Token = {
  id: string;
  index: number;
  name: string;
  symbol: string;
  image: string;
  address: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCapChange24h: number;
  marketCapChangePercentage24h: number;
  totalSupply: number;
  circulatingSupply?: number;
};
