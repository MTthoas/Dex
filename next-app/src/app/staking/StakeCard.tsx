import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function StakingCard() {
    return (
        <Card className="bg-secondary text-white rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle>Stake GEN Tokens</CardTitle>
                  <CardDescription>Enter the amount and duration to stake your GEN tokens.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount of Tokens</Label>
                    <Input id="amount" placeholder="0.00" type="number" />
                    <div className="flex flex-row-reverse space-x-reverse space-x-6">
                      <span className="text-xs">Staked: 1.45</span>
                      <span className="text-xs">Earn: 0.2345</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-2">
                  <Button className="w-full">Stake Tokens</Button>
                  <Button className="w-full">Unstake Tokens</Button>
                </CardFooter>
              </Card>
    )
}