import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function StakingCard() {
    return (
        <Card className="bg-[#1E1E2D] text-white rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle>Stake GEN Tokens</CardTitle>
                  <CardDescription>Enter the amount and duration to stake your GEN tokens.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount of Tokens</Label>
                    <Input id="amount" placeholder="0.00" type="number" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Stake Tokens</Button>
                  <Button className="w-full">Unstake Tokens</Button>
                </CardFooter>
              </Card>
    )
}