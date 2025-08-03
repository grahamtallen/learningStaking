"use client";

import { StakingCard } from "./StakingCard";
import { Withdrawal } from "./Withdrawal";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseGetWithdrawEstimate } from "~~/utils/scaffold-eth";

export const StakingAndWithdrawal = () => {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "Staker" });
  const refresh = async () => await writeContractAsync({ functionName: "execute" });
  const stakeInEth = async (amount: string) => {
    await writeContractAsync({ functionName: "stake", value: parseEther(amount) });
    await refresh();
  };
  const onWithdraw = async () => {
    await writeContractAsync({ functionName: "withdraw" });
    await refresh();
  };

  const { data: getWithDrawestimate } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "getWithdrawEstimate",
    args: [connectedAddress],
    watch: true,
  });
  const withdrawEstimate = parseGetWithdrawEstimate(getWithDrawestimate);

  return (
    <div className="flex items-center flex-row justify-center flex-grow w-full px-4 gap-12">
      <StakingCard stakeInEth={stakeInEth} withdrawalEstimate={withdrawEstimate} />
      <Withdrawal onWithdraw={onWithdraw} withdrawalEstimate={withdrawEstimate} />
    </div>
  );
};
