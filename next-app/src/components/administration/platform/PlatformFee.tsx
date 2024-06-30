"use client";
import { JSX, SVGProps, useState } from "react";
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

const PlatformFee = () => {
  const [feePercentage, setFeePercentage] = useState(3);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleFeePercentageChange = (e: { target: { value: string; }; }) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0 || value > 10) {
      return;
    }
    setFeePercentage(value);
  };
  const handleSaveChanges = () => {
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
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
          <div className="grid gap-2">
            <Label htmlFor="fee-percentage">Fee Percentage</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fee-percentage"
                type="number"
                value={feePercentage}
                onChange={handleFeePercentageChange}
                min={0}
                max={10}
                step={0.1}
                className="w-24"
              />
              <span>%</span>
            </div>
          </div>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardContent>
        {showConfirmation && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-xs p-6 text-center">
              <CardContent>
                <CircleCheckIcon className="mx-auto mb-4 h-8 w-8 text-green-500" />
                <p className="font-medium">
                  Trading fees updated successfully!
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

function CircleCheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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

export default PlatformFee;
