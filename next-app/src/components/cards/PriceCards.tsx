import { formatPrice } from '@/lib/price'

interface PriceCardProps {
  label: string;
  price: number;
}

interface PriceCardsProps {
    price: number;
    totalLiquidity: number;
    totalVolume: number;
    totalPairs: number;
}

export const PriceCard = ({ label, price }: PriceCardProps)=> {
    return (
        <div className="bg-[#1e1f23] p-6 rounded-lg">
            <div className="text-[#bd1e59] text-sm">${label}</div>
            <div className="text-2xl font-semibold">${formatPrice(price)}</div>
        </div>
    )
}

export const PriceCards = ({ price, totalLiquidity, totalVolume, totalPairs} : PriceCardsProps) => {

    return (

        <div className="grid grid-cols-2 gap-4">
            <PriceCard label="PRICE" price={price} />
            <PriceCard label="TOTAL LIQUIDITY" price={totalLiquidity} />
             <PriceCard label="TOTAL VOLUME" price={totalVolume} />
              <PriceCard label="TOTAL LIQUIDITY" price={totalPairs} />
        </div>

    )

}
