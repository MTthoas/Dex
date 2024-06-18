import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SwapCard({ isConnected }: { isConnected: boolean }) {
  return (
    <Card className=" bg-secondary  rounded-lg shadow-lg h-[480px]">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Swap</CardTitle>
        <CardDescription className="text-sm">
          Trade tokens in an instant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {/* <Combobox tokens={tokens} /> */}
          </div>
          <span className="text-xs">Balance: 0.05131</span>
        </div>
        <div className="bg-[#2D2D3A] rounded-lg mb-4">
          <Input placeholder="0.0" />
        </div>
        <div className="flex justify-center my-4">
          <ArrowDownIcon className="text-green-400  p-1 bg-secondary rounded-lg" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {/* <Combobox tokens={tokens} /> */}
          </div>
          <span className="text-xs">Balance: 0</span>
        </div>
        <div className="bg-[#2D2D3A] rounded-lg mb-4">
          <Input placeholder="0.0" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs">Slippage Tolerance</span>
          <Badge className="text-xs" variant="secondary">
            0.5%
          </Badge>
        </div>
        {isConnected ? (
          <Button className="w-full"> Swap </Button>
        ) : (
          <Button className="w-full"> Connect to your account </Button>
        )}
      </CardContent>
    </Card>
  );
}

function ArrowDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}
