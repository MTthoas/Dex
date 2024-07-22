import { liquidityFactoryAddress } from "@/abi/address";
import { ERC20 } from "@/abi/ERC20";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import LiquidityPoolList from "@/components/liquidityPool/LiquidityPoolList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTimeRemaining } from "@/utils/time.utils";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";
import { useFetchTokensPairsByAddressList } from "../../hook/useFetchTokenPairs";
import { getSigner, useFactoryContract } from "../dashboard/Contracts";
import { Input } from "../ui/input";

export type TokenPair = {
  id: number;
  address: string;
  tokenA: string;
  tokenB: string;
};

export default function Layout() {
  const { address, chainId } = useAccount();
  const [errorAddPool, setErrorAddPool] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addLiquidityModal, setAddLiquidityModal] = useState(false);
  const [pairsSelected, setPairsSelected] = useState<any[]>([]);
  const [addLiquidityAmountA, setAddLiquidityAmountA] = useState("");
  const [addLiquidityAmountB, setAddLiquidityAmountB] = useState("");
  const [balanceTokenA, setBalanceTokenA] = useState(0);
  const [balanceTokenB, setBalanceTokenB] = useState(0);
  const [removeLiquidityAmountA, setRemoveLiquidityAmountA] = useState("");
  const [removeLiquidityAmountB, setRemoveLiquidityAmountB] = useState("");
  const [removeLiquidityModal, setRemoveLiquidityModal] = useState(false);
  const [claimRewardsModal, setClaimRewardsModal] = useState(false);
  const [maxWithdrawableA, setMaxWithdrawableA] = useState(0);
  const [maxWithdrawableB, setMaxWithdrawableB] = useState(0);
  const [errorModal, setErrorModal] = useState("");
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [ratio, setRatio] = useState(1);
  const signer = getSigner(chainId);

  const FactoryContract = useFactoryContract({
    address: liquidityFactoryAddress,
    chainId,
  });

  const { data: listOfAddress, refetch } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
    address: liquidityFactoryAddress as `0x${string}`,
    chainId,
  });

  const { data: addressLPT } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "liquidityToken",
    address: liquidityFactoryAddress as `0x${string}`,
    args: [],
    chainId,
  });

  const { data: baaa } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "calculateRewards",
    address: "0x405313d423FE4A3347f76c9875f42f7d4C7d6501" as `0x${string}`,
    args: [address],
    chainId,
  });

  const { data: balanceLPT } = useReadContract({
    abi: ERC20,
    functionName: "balanceOf",
    address: addressLPT as `0x${string}`,
    args: [address],
    chainId,
  });

  const { pairs, allTokens } = useFetchTokensPairsByAddressList(
    listOfAddress,
    chainId
  );

  console.log("AllTokens", allTokens);

  const handleAddLiquidity = async () => {
    if (!pairsSelected) return;
    if (!addLiquidityAmountA || !addLiquidityAmountB) return;
    // If amount are equal to 0
    if (
      BigInt(addLiquidityAmountA) === 0n ||
      BigInt(addLiquidityAmountB) === 0n
    ) {
      console.error("Amount must be greater than 0");
      toast.error("Amount must be greater than 0");
      return;
    }
    console.log("pairsSelected", pairsSelected);

    try {
      const tokenA = allTokens.find(
        (token: any) => token.token === (pairsSelected.tokenA as string)
      );
      const tokenB = allTokens.find(
        (token: any) => token.token === (pairsSelected.tokenB as string)
      );

      if (!tokenA || !tokenB) {
        console.error("Token not found");
        toast.error("Token not found");
        return;
      }

      console.log("tokenA", tokenA);
      console.log("tokenB", tokenB);

      const tokenAContract = new ethers.Contract(tokenA.address, ERC20, signer);
      const tokenBContract = new ethers.Contract(tokenB.address, ERC20, signer);
      const liquidityPoolContract = new ethers.Contract(
        pairsSelected.address,
        LiquidityPoolABI,
        signer
      );

      if (
        BigInt(addLiquidityAmountA) <= 0 ||
        BigInt(addLiquidityAmountB) <= 0
      ) {
        console.error("Liquidity amounts must be greater than zero");
        toast.error("Liquidity amounts must be greater than zero");
        return;
      }

      console.log("Approving token A...");
      const approveTokenATx = await tokenAContract.approve(
        pairsSelected.address,
        ethers.parseUnits(BigInt(addLiquidityAmountA).toString(), 18)
      );

      console.log("Approving token B...");
      const approveTokenBTx = await tokenBContract.approve(
        pairsSelected.address,
        ethers.parseUnits(BigInt(addLiquidityAmountB).toString(), 18)
      );

      await Promise.all([approveTokenATx.wait(), approveTokenBTx.wait()]);

      console.log("Adding liquidity to the pool...");
      console.log("Liquidity A:", addLiquidityAmountA);
      console.log("Liquidity B:", addLiquidityAmountB);

      const addLiquidityTx = await liquidityPoolContract.addLiquidity(
        ethers.parseUnits(BigInt(addLiquidityAmountA).toString(), 18),
        ethers.parseUnits(BigInt(addLiquidityAmountB).toString(), 18)
      );
      await addLiquidityTx.wait();
      toast.success("Liquidity added successfully", {
        description: "Hash :" + addLiquidityTx.hash,
      });
      await refetch(); // Ensure refetch is awaited
    } catch (error) {
      console.error("Failed to add liquidity:", error.message);
      toast.error("Failed to add liquidity");
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!pairsSelected) return;
    if (!removeLiquidityAmountA || !removeLiquidityAmountB) return;

    // verify if amount is greater than limit withdrawable
    if (
      Number(removeLiquidityAmountA) > maxWithdrawableA ||
      Number(removeLiquidityAmountB) > maxWithdrawableB
    ) {
      console.error("Amount is greater than the maximum withdrawable amount");
      setErrorModal("Amount is greater than the maximum withdrawable amount");
      toast.error("Amount is greater than the maximum withdrawable amount");
      return;
    }

    // Verify if time chrono is over, pairsSelected.timeRemaining = 5826n
    const timeRemaining = Number(pairsSelected.timeRemaining);
    if (timeRemaining > 0) {
      const { hours, minutes, seconds } = formatTimeRemaining(timeRemaining);
      console.log(
        `Chrono will be over in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`
      );
      setErrorModal(
        `Chrono will be over in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`
      );
      toast.error(
        `Chrono will be over in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`
      );
      return;
    }

    const liquidityPoolContract = new ethers.Contract(
      pairsSelected.address,
      LiquidityPoolABI,
      signer
    );

    try {
      const removeLiquidityTx = await liquidityPoolContract.removeLiquidity(
        ethers.parseUnits(BigInt(removeLiquidityAmountA).toString(), 18),
        ethers.parseUnits(BigInt(removeLiquidityAmountB).toString(), 18)
      );
      await removeLiquidityTx.wait();
      setRemoveLiquidityModal(false);
      await refetch(); // Ensure refetch is awaited
      toast.success("Liquidity removed successfully");
    } catch (error) {
      console.error("Failed to remove liquidity:", error.message);
      toast.error("Failed to remove liquidity");
    }
  };

  const handleClaimRewards = async (pairtoClaim) => {
    if (!pairtoClaim) return;
    setLoadingRewards(true);
    console.log("pairtoClaim", pairtoClaim);

    const liquidityPoolContract = new ethers.Contract(
      pairtoClaim.address,
      LiquidityPoolABI,
      signer
    );

    try {
      const claimRewardsTx = await liquidityPoolContract.claimRewards();
      await claimRewardsTx.wait();
      setClaimRewardsModal(false);
      await refetch(); // Ensure refetch is awaited
      toast.success("Rewards claimed successfully");
    } catch (error) {
      console.error("Failed to claim rewards:", error.message);
      setLoadingRewards(false);
      toast.error("Failed to claim rewards");
    }
  };

  useEffect(() => {
    if (pairsSelected && addLiquidityAmountA) {
      const reserveA = Number(ethers.formatEther(pairsSelected.reserveA));
      const reserveB = Number(ethers.formatEther(pairsSelected.reserveB));

      if (addLiquidityAmountA && addLiquidityAmountA.trim() !== "") {
        if (reserveB === 0 && reserveA === 0) {
          return setAddLiquidityAmountB(addLiquidityAmountA);
        }
        const amountB = (
          Number(addLiquidityAmountA) *
          (reserveA / reserveB)
        ).toFixed(0);
        setAddLiquidityAmountB(amountB);
      } else {
        setAddLiquidityAmountB("");
      }
    }
  }, [addLiquidityAmountA]);

  useEffect(() => {
    if (pairsSelected && addLiquidityAmountB) {
      const reserveA = Number(ethers.formatEther(pairsSelected.reserveA));
      const reserveB = Number(ethers.formatEther(pairsSelected.reserveB));

      if (addLiquidityAmountB && addLiquidityAmountB.trim() !== "") {
        if (reserveB === 0 && reserveA === 0) {
          return setAddLiquidityAmountA(addLiquidityAmountB);
        }
        const amountA = (
          Number(addLiquidityAmountB) /
          (reserveA / reserveB)
        ).toFixed(0);
        setAddLiquidityAmountA(amountA);
      } else {
        setAddLiquidityAmountA("");
      }
    }
  }, [addLiquidityAmountB]);

  useEffect(() => {
    // Update ratio
    if (pairsSelected && pairsSelected.reserveA && pairsSelected.reserveB) {
      const reserveA = Number(ethers.formatEther(pairsSelected.reserveA));
      const reserveB = Number(ethers.formatEther(pairsSelected.reserveB));
      if (reserveB === 0 && reserveA === 0) {
        setRatio(1);
      } else {
        setRatio(reserveA / reserveB);
      }
    }

    console.log("pairsSelected :", pairsSelected);

    if (pairsSelected && pairsSelected.tokenA && pairsSelected.tokenB) {
      const tokenA = allTokens.find(
        (token: any) => token.token === pairsSelected.tokenA
      );
      const tokenB = allTokens.find(
        (token: any) => token.token === pairsSelected.tokenB
      );

      if (tokenA && tokenB) {
        const tokenAContract = new ethers.Contract(
          tokenA.address,
          ERC20,
          signer
        );
        const tokenBContract = new ethers.Contract(
          tokenB.address,
          ERC20,
          signer
        );

        const getBalance = async () => {
          const balanceA = await tokenAContract.balanceOf(address);
          const balanceB = await tokenBContract.balanceOf(address);

          setBalanceTokenA(Number(ethers.formatEther(balanceA)));
          setBalanceTokenB(Number(ethers.formatEther(balanceB)));
        };

        getBalance();
      }
    }
  }, [addLiquidityModal]);

  useEffect(() => {
    if (
      pairsSelected &&
      pairsSelected.tokenAAmount &&
      pairsSelected.tokenBAmount
    ) {
      console.log("pairsSelected", pairsSelected);
      setMaxWithdrawableA(
        Number(ethers.formatEther(pairsSelected.tokenAAmount))
      );
      setMaxWithdrawableB(
        Number(ethers.formatEther(pairsSelected.tokenBAmount))
      );
    }
  }, [removeLiquidityModal]);

  return (
    <div>
      <Dialog
        onOpenChange={() => {
          setErrorAddPool(""), setErrorModal("");
        }}
      >
        <div className="my-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">List of Liquidity Pools</h1>
        </div>
        {addressLPT && balanceLPT && (
          <p>
            Balance of LPT:{" "}
            <span className="font-mono">
              {Number(ethers.formatEther(balanceLPT)).toFixed(2)}
            </span>
          </p>
        )}

        <div className="grid grid-row gap-6">
          <LiquidityPoolList
            pairs={pairs}
            setAddLiquidityModal={setAddLiquidityModal}
            setPairsSelected={setPairsSelected}
            setRemoveLiquidityModal={setRemoveLiquidityModal}
            handleClaimRewards={handleClaimRewards}
            loadingRewards={loadingRewards}
          />
        </div>
      </Dialog>

      {/* Remove Liquidity Modal */}
      <Dialog
        open={removeLiquidityModal}
        onOpenChange={setRemoveLiquidityModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="my-3">Remove Liquidity</DialogTitle>
            Remove liquidity amount of each tokens from the pool
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-3">
            <p>Maximum withdrawable amounts:</p>
            <p>{`Token ${pairsSelected.tokenA}: ${maxWithdrawableA}`}</p>
            <p>{`Token ${pairsSelected.tokenB}: ${maxWithdrawableB}`}</p>
            <Input
              type="number"
              placeholder={`Amount of ` + pairsSelected.tokenA}
              value={removeLiquidityAmountA}
              onChange={(e) => setRemoveLiquidityAmountA(e.target.value)}
            />
            <Input
              type="number"
              placeholder={`Amount of ` + pairsSelected.tokenB}
              value={removeLiquidityAmountB}
              onChange={(e) => setRemoveLiquidityAmountB(e.target.value)}
            />
          </DialogDescription>
          <DialogFooter>
            <div className="flex justify-between w-full">
              {errorModal !== "" && (
                <p className="text-red-500">{errorModal}</p>
              )}
              <Button onClick={handleRemoveLiquidity}>Remove Liquidity</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Liquidity Modal */}
      <Dialog open={addLiquidityModal} onOpenChange={setAddLiquidityModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="my-3">Add Liquidity</DialogTitle>
            Add liquidity amount of each tokens to the pool
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-3">
            <Input
              type="number"
              placeholder={`Amount of ` + pairsSelected.tokenA}
              value={addLiquidityAmountA}
              onChange={(e) => setAddLiquidityAmountA(e.target.value)}
            />
            <span className="text-muted-foreground text-sm">
              Balance: {balanceTokenA}
            </span>
            <Input
              type="number"
              placeholder={`Amount of ` + pairsSelected.tokenB}
              value={addLiquidityAmountB}
              onChange={(e) => setAddLiquidityAmountB(e.target.value)}
            />
            <span className="text-muted-foreground text-sm">
              Balance: {balanceTokenB}
            </span>
          </DialogDescription>
          <DialogFooter>
            <div className="flex justify-between w-full">
              <span> Ratio: {ratio}</span>
              <Button onClick={handleAddLiquidity}>Add Liquidity</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction hash Dialog  */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Successful</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Your pool creation transaction has been processed successfully.
            <br />
            Transaction Hash:{" "}
            <span className="font-mono">{transactionHash}</span>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
