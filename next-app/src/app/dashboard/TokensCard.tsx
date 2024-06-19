/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7XpQBGLhk8E
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";

export default function TokensCard() {
  return (
    <div className="bg-[#1a1a2e] text-white rounded-lg p-4 w-2/3">
      <div className="flex items-center space-x-2 mb-4">
        <HexagonIcon className="text-[#0f3460] h-8 w-8" />
        <span className="font-bold text-lg">GENX</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Price</span>
          <span>$2.26</span>
        </div>
        <div className="flex justify-between">
          <span>Total Staked</span>
          <span>9790.98 GMD ($22173.40)</span>
        </div>
        <div className="flex justify-between">
          <span>Circulating Supply</span>
          <span>55,557.09 GENX</span>
        </div>
        <div className="flex justify-between">
          <span>Total Supply</span>
          <span>80,000.00 GENX</span>
        </div>
        <div className="flex justify-between">
          <span>Circulating Market Cap</span>
          <span>$125,818.80</span>
        </div>
        <div className="flex justify-between">
          <span>Fully Diluted Market Cap</span>
          <span>$181,174.08</span>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button className="bg-[#e94560] text-white"> Buy token </Button>
      </div>
    </div>
  );
}

function HexagonIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}
