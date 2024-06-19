import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Combobox } from "./Combobox"

export default function SwapCard() {
  return (
    <Card className="w-[376px] bg-[#1E1E2D] text-white rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Swap</CardTitle>
        <CardDescription className="text-sm">Trade tokens in an instant</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Combobox />
          </div>
          <span className="text-xs">Balance: 0.05131</span>
        </div>
        <div className="bg-[#2D2D3A] rounded-lg mb-4">
          <Input className="bg-transparent text-white placeholder-gray-500" placeholder="0.0" />
        </div>
        <div className="flex space-x-2 mb-4">
          <Button className="bg-[#313140] text-xs" variant="secondary">
            25%
          </Button>
          <Button className="bg-[#313140] text-xs" variant="secondary">
            50%
          </Button>
          <Button className="bg-[#313140] text-xs" variant="secondary">
            75%
          </Button>
          <Button className="bg-[#313140] text-xs" variant="secondary">
            MAX
          </Button>
        </div>
        <div className="flex justify-center my-8">
          <ArrowDownIcon className="text-green-400  p-1 bg-[#2D2D3A] rounded-lg"/>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
           <Combobox />
          </div>
          <span className="text-xs">Balance: 0</span>
        </div>
        <div className="bg-[#2D2D3A] rounded-lg mb-4">
          <Input className="bg-transparent text-white placeholder-gray-500" placeholder="0.0" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs">Slippage Tolerance</span>
          <Badge className="text-xs" variant="secondary">
            0.5%
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="w-full">Enter an amount</Button>
      </CardFooter>
    </Card>
  )
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
  )
}


// function BitcoinIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
//     </svg>
//   )
// }


// function SlidersIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <line x1="4" x2="4" y1="21" y2="14" />
//       <line x1="4" x2="4" y1="10" y2="3" />
//       <line x1="12" x2="12" y1="21" y2="12" />
//       <line x1="12" x2="12" y1="8" y2="3" />
//       <line x1="20" x2="20" y1="21" y2="16" />
//       <line x1="20" x2="20" y1="12" y2="3" />
//       <line x1="2" x2="6" y1="14" y2="14" />
//       <line x1="10" x2="14" y1="8" y2="8" />
//       <line x1="18" x2="22" y1="16" y2="16" />
//     </svg>
//   )
// }