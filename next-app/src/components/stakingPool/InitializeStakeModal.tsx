"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StakingFactoryModalInitializeStakeProps {
  onInitialize: () => void;
  reserved: string;
  setReserved: (value: string) => void;
}

const StakingFactoryModalInitializeStake: React.FC<StakingFactoryModalInitializeStakeProps> = ({ onInitialize, reserved, setReserved }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Initialize Pool</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reserve of the pool</DialogTitle>
          <DialogDescription>Set the reserve</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reserve" className="text-right">
              Reserve
            </Label>
            <Input
              id="reserve"
              placeholder="1000"
              value={reserved}
              onChange={(e) => setReserved(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onInitialize}>Initialize</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default StakingFactoryModalInitializeStake;