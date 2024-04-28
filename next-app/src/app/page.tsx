import { TransactionCard } from "@/components/cards/TransactionsCard";
import { PriceCards } from "@/components/cards/PriceCards";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div key="1" className="text-white min-h-screen mx-auto my-12 px-3">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-6xl font-bold mb-4">
              Buy and Sell Instantly on GenX.
              <span className="text-[#bd1e59]">Wherever.</span>
            </h1>
            <p className="text-xl mb-8">
              Unlock the world of cryptocurrency trading. Experience the freedom
              to trade over 400 tokens instantly, no registration needed.
            </p>
            <PriceCards
              price={1.17}
              totalLiquidity={407610000}
              totalVolume={0}
              totalPairs={53310}
            />
          </div>
          <div className="bg-[#1e1f23] p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">Latest Transactions</h2>
              <div className="flex flex-col space-y-4 mb-5 overflow-auto max-h-64">
                {[...Array(10)].map((_, index) => (
                  <TransactionCard
                    key={index}
                    transaction={{
                      index,
                      amount: Math.random(),
                      label: "ETH",
                      price: Math.random() * 10,
                      timestamp: new Date(),
                    }}
                  />
                ))}
              </div>
            </div>
            <Button className="bg-[#bd1e59] text-white w-full mt-4">
              View All Transactions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
