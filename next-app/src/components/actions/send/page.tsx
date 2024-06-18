import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Combobox } from "../Combobox";
import SendCryptoCard from "../SendCard";

interface Token {
  value: string;
  label: string;
  chainId: number;
}

interface SendCardProps {
  isConnected: boolean;
  tokens: Token[];
  balance: any;
  cryptoSelected: any;
  setCryptoSelected: any;
  handleTransfer: any;
}

export default function SendCard({
  isConnected,
  tokens,
  balance,
  cryptoSelected,
  setCryptoSelected,
  handleTransfer,
}: SendCardProps) {
  console.log(balance);
  return (
    <Card className="bg-secondary text-primary rounded-lg shadow-lg  h-[480px]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary">Send</CardTitle>
        <CardDescription className="text-sm">
          Send tokens to an address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Combobox
              tokens={tokens}
              cryptoSelected={cryptoSelected}
              setCryptoSelected={setCryptoSelected}
            />
          </div>
          <span className="text-xs">Balance: {Number(balance).toFixed(4)}</span>
        </div>
        <div className=" mb-4">
          <div>
            <CardDescription className="text-sm mt-4 mb-2">
              Give an address
            </CardDescription>
            <div>
              <Input className="" placeholder="0x.." type="text" />
            </div>
          </div>
          <CardDescription className="text-sm text-primary mt-4 mb-2">
            Amount to send
          </CardDescription>
          <SendCryptoCard />
          {isConnected ? (
            <Button
              onClick={() => handleTransfer(0.01)}
              className="w-full mt-4"
            >
              {" "}
              Send Transaction{" "}
            </Button>
          ) : (
            <Button className="w-full mt-4"> Connect to your account </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
