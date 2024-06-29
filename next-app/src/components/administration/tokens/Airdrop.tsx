import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

const Airdrop = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Donate Tokens</CardTitle>
          <CardDescription>
            Distribute free tokens to your users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="address">Recipient Address</Label>
              <Input
                id="address"
                placeholder="Enter recipient's address"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="Enter amount of tokens"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={false}>
            Donate Tokens
          </Button>
        </CardFooter>
        <Dialog>
          <DialogTrigger asChild />
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <CircleCheckIcon className="size-12 text-green-500" />
              <p className="text-lg font-medium">
                Tokens Donated Successfully!
              </p>
            </div>
            <DialogFooter>
              <div>
                <Button type="button">OK</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

function CircleCheckIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default Airdrop;
