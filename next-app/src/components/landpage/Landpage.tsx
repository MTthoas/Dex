/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pE4SkRC9YFo
 */
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div key="1" className="text-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-6xl font-bold mb-4">
              Buy and Sell Instantly on GenX.
              <span className="text-[#bd1e59]">Wherever.</span>
            </h1>
            <p className="text-xl mb-8">
              Unlock the world of cryptocurrency trading. Experience the freedom to trade over 400 tokens instantly, no
              registration needed.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e1f23] p-6 rounded-lg">
                <div className="text-[#bd1e59] text-sm">PRICE</div>
                <div className="text-2xl font-semibold">$1.17</div>
              </div>
              <div className="bg-[#1e1f23] p-6 rounded-lg">
                <div className="text-[#bd1e59] text-sm">TOTAL LIQUIDITY</div>
                <div className="text-2xl font-semibold">$407.61m</div>
              </div>
              <div className="bg-[#1e1f23] p-6 rounded-lg">
                <div className="text-[#bd1e59] text-sm">TOTAL VOLUME</div>
                <div className="text-2xl font-semibold">-</div>
              </div>
              <div className="bg-[#1e1f23] p-6 rounded-lg">
                <div className="text-[#bd1e59] text-sm">TOTAL PAIRS</div>
                <div className="text-2xl font-semibold">53.31k</div>
              </div>
            </div>
          </div>
          <div className="bg-[#1e1f23] p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">Latest Transactions</h2>
              <div className="flex flex-col space-y-4 mb-5 overflow-auto max-h-64"> {/* Ajout de styles pour le scroll */}
                {/* Exemple de données supplémentaires */}
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="text-xl font-semibold">{Math.random().toFixed(3)} ETH</div>
                    <div className="text-right text-[#627eea]">$ {(Math.random() * 1000).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <Button className="bg-[#bd1e59] text-white w-full mt-4">View All Transactions</Button>
          </div>
        </div>
      </div>
    </div>
  )
}