"use client";
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
import { queryClient } from "@/context";
import { postTransaction } from "@/hook/transactions.hook";
import { EnumTransactionType } from "@/types/transaction.type";
import { formatTimeRemaining } from "@/utils/time.utils";
import { useMutation } from "@tanstack/react-query";
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
  const [loading, setLoading] = useState({
    addLiquidity: false,
    removeLiquidity: false,
  });
  const [ratio, setRatio] = useState(1);
  const signer = getSigner(chainId);

  const mutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

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

  const handleAddLiquidity = async () => {
    setLoading((prev) => ({ ...prev, addLiquidity: true }));
    if (!pairsSelected) return;
    if (!addLiquidityAmountA || !addLiquidityAmountB) return;
    if (
      BigInt(addLiquidityAmountA) === 0n ||
      BigInt(addLiquidityAmountB) === 0n
    ) {
      console.error("Amount must be greater than 0");
      toast.error("Amount must be greater than 0");
      setLoading((prev) => ({ ...prev, addLiquidity: false }));
      return;
    }

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
        setLoading((prev) => ({ ...prev, addLiquidity: false }));
        return;
      }

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
        setLoading((prev) => ({ ...prev, addLiquidity: false }));
        return;
      }

      const approveTokenATx = await tokenAContract.approve(
        pairsSelected.address,
        ethers.parseUnits(BigInt(addLiquidityAmountA).toString(), 18)
      );

      const approveTokenBTx = await tokenBContract.approve(
        pairsSelected.address,
        ethers.parseUnits(BigInt(addLiquidityAmountB).toString(), 18)
      );

      await Promise.all([approveTokenATx.wait(), approveTokenBTx.wait()]);

      const addLiquidityTx = await liquidityPoolContract.addLiquidity(
        ethers.parseUnits(BigInt(addLiquidityAmountA).toString(), 18),
        ethers.parseUnits(BigInt(addLiquidityAmountB).toString(), 18)
      );
      await addLiquidityTx.wait();
      toast.success("Liquidity added successfully", {
        description: "Hash :" + addLiquidityTx.hash,
      });

      mutation.mutate({
        amount: Number(addLiquidityAmountA),
        created_at: new Date().toISOString(),
        from: address,
        hash: addLiquidityTx.hash,
        amount_a: Number(addLiquidityAmountA),
        amount_b: Number(addLiquidityAmountB),
        symbol_a: pairsSelected.tokenA,
        symbol_b: pairsSelected.tokenB,
        to: pairsSelected.address,
        type: EnumTransactionType.AddLiquidity,
        updated_at: new Date().toISOString(),
      });

      await refetch();
      setAddLiquidityModal(false);
    } catch (error) {
      console.error("Failed to add liquidity:", error.message);
      toast.error("Failed to add liquidity");
    } finally {
      setLoading((prev) => ({ ...prev, addLiquidity: false }));
    }
  };

  const handleRemoveLiquidity = async () => {
    setLoading((prev) => ({ ...prev, removeLiquidity: true }));
    if (!pairsSelected) return;
    if (!removeLiquidityAmountA || !removeLiquidityAmountB) return;

    if (
      Number(removeLiquidityAmountA) > maxWithdrawableA ||
      Number(removeLiquidityAmountB) > maxWithdrawableB
    ) {
      console.error("Amount is greater than the maximum withdrawable amount");
      setErrorModal("Amount is greater than the maximum withdrawable amount");
      toast.error("Amount is greater than the maximum withdrawable amount");
      setLoading((prev) => ({ ...prev, removeLiquidity: false }));
      return;
    }

    const timeRemaining = Number(pairsSelected.timeRemaining);
    if (timeRemaining > 0) {
      const { hours, minutes, seconds } = formatTimeRemaining(timeRemaining);
      setErrorModal(
        `Chrono will be over in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`
      );
      toast.error(
        `Chrono will be over in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`
      );
      setLoading((prev) => ({ ...prev, removeLiquidity: false }));
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

      mutation.mutate({
        amount: Number(removeLiquidityAmountA),
        created_at: new Date().toISOString(),
        from: address,
        hash: removeLiquidityTx.hash,
        amount_a: Number(removeLiquidityAmountA),
        amount_b: Number(removeLiquidityAmountB),
        symbol_a: pairsSelected.tokenA,
        symbol_b: pairsSelected.tokenB,
        to: pairsSelected.address,
        type: EnumTransactionType.RemoveLiquidity,
        updated_at: new Date().toISOString(),
      });

      setRemoveLiquidityModal(false);
      await refetch();
      toast.success("Liquidity removed successfully");
    } catch (error) {
      console.error("Failed to remove liquidity:", error.message);
      toast.error("Failed to remove liquidity");
    } finally {
      setLoading((prev) => ({ ...prev, removeLiquidity: false }));
    }
  };

  const handleClaimRewards = async (pairtoClaim) => {
    if (!pairtoClaim) return;
    setLoadingRewards(true);

    const liquidityPoolContract = new ethers.Contract(
      pairtoClaim.address,
      LiquidityPoolABI,
      signer
    );

    try {
      const claimRewardsTx = await liquidityPoolContract.claimRewards();
      await claimRewardsTx.wait();
      setClaimRewardsModal(false);
      await refetch();

      mutation.mutate({
        amount: Number(pairtoClaim.liquidityTokens),
        created_at: new Date().toISOString(),
        from: address,
        hash: claimRewardsTx.hash,
        amount_a: Number(ethers.formatEther(pairtoClaim.liquidityTokens)),
        amount_b: 0,
        symbol_a: "LPT",
        symbol_b: "",
        to: pairtoClaim.address,
        type: EnumTransactionType.Claim,
        updated_at: new Date().toISOString(),
      });

      toast.success("Rewards claimed successfully");
    } catch (error) {
      console.error("Failed to claim rewards:", error.message);
      toast.error("Failed to claim rewards");
    } finally {
      setLoadingRewards(false);
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
    if (pairsSelected && pairsSelected.reserveA && pairsSelected.reserveB) {
      const reserveA = Number(ethers.formatEther(pairsSelected.reserveA));
      const reserveB = Number(ethers.formatEther(pairsSelected.reserveB));
      if (reserveB === 0 && reserveA === 0) {
        setRatio(1);
      } else {
        setRatio(reserveA / reserveB);
      }
    }

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
              <Button
                onClick={handleRemoveLiquidity}
                disabled={loading.removeLiquidity}
              >
                {loading.removeLiquidity ? "Removing..." : "Remove Liquidity"}
              </Button>
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
              <Button
                onClick={handleAddLiquidity}
                disabled={loading.addLiquidity}
              >
                {loading.addLiquidity ? "Adding..." : "Add Liquidity"}
              </Button>
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
