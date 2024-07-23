"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheckIcon } from "@/components/Icons";
import {
  useReadLiquidityPoolPlatformFee,
  useWriteLiquidityPoolUpdatePlatformFee,
} from "@/hook/WagmiGenerated";
import { formatUnits } from "viem";

const PlatformFee = () => {
  const { data, isLoading, error, isSuccess, isError } =
    useReadLiquidityPoolPlatformFee();
  const { writeContractAsync: writeLiquidityPoolPlatformFee } =
    useWriteLiquidityPoolUpdatePlatformFee();
  const [feePercentage, setFeePercentage] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveChanges = async () => {
    setShowError(null);
    setIsUpdating(true);
    try {
      if (feePercentage !== "" && parseFloat(feePercentage) >= 0) {
        const feePercentageBigInt = BigInt(
          Math.round(parseFloat(feePercentage) * 100)
        ); // In basis points (0.01% = 1)
        console.log("Updating platform fee to:", feePercentageBigInt);
        await writeLiquidityPoolPlatformFee({
          args: [feePercentageBigInt],
        }).then((hash) => {
          console.log("Platform fee updated with hash:", hash);
          setShowConfirmation(true);
          setTimeout(() => setShowConfirmation(false), 3000);
        });
      }
    } catch (writeError: any) {
      console.error("Failed to update platform fee:", writeError);
      setShowError(writeError.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Trading Fees</CardTitle>
          <CardDescription>
            Adjust the trading fee percentage for your platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <div>Loading contract value...</div>}
          {isError && error && (
            <div className="text-red-500 flex items-center gap-2">
              <span>Error: {error.message}</span>
            </div>
          )}
          {isSuccess && data && <div>Actual fees: {formatUnits(data, 2)}%</div>}

          <div className="grid gap-2">
            <Label htmlFor="fee-percentage">Fee Percentage</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fee-percentage"
                type="number"
                value={feePercentage}
                onChange={(e) => setFeePercentage(e.target.value)}
                min={0}
                max={100}
                step={0.01}
                className="w-24"
                disabled={isUpdating}
              />
              <span>%</span>
            </div>
          </div>
          <Button onClick={handleSaveChanges} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {showConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-xs p-6 text-center">
            <CardContent>
              <CircleCheckIcon className="mx-auto mb-4 h-8 w-8 text-green-500" />
              <p className="font-medium">Trading fees updated successfully!</p>
            </CardContent>
          </Card>
        </div>
      )}

      {showError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-xs p-6 text-center">
            <CardContent>
              <p className="font-medium text-red-500">Error: {showError}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlatformFee;
