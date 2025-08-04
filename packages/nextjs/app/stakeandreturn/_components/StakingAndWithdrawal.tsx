"use client";

import { StakingCard } from "./StakingCard";
import { Withdrawal } from "./Withdrawal";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { ExplainerCopy } from "~~/components/ExplainerCopy";
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
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center" style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
        <h1 className="text-3xl font-bold mb-4">Staking Contract</h1>
        <ExplainerCopy />
      </div>
      <div className="flex items-center flex-row justify-center flex-grow w-full px-4 gap-12">
        <StakingCard stakeInEth={stakeInEth} withdrawalEstimate={withdrawEstimate} />
        <Withdrawal onWithdraw={onWithdraw} withdrawalEstimate={withdrawEstimate} />
      </div>
    </div>
  );
};
