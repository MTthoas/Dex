import Globe from "@/components/magicui/globe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, DollarSign } from "lucide-react";

const page = () => {
  return (
    <div key="1" className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 ml-12">
          <div className="lg:col-span-2">
            <h1 className="text-7xl font-bold mb-4">
              Buy and Sell Instantly on
              <span className="text-[#bd1e59]"> GenX DEX</span>
            </h1>
            <p className="text-xl mb-8">
              Unlock the world of cryptocurrency trading. Experience the freedom
              to trade over 400 tokens instantly, no registration needed.
            </p>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
              <Card className="bg-transparant">
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">$1,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-01-chunk-0" className="bg-transparant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-3" className="bg-transparant">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden">
            <Globe className="top-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
