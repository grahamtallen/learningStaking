"use client";

import { StakingCard } from "./StakingCard";
import { Withdrawal } from "./Withdrawal";
import { parseEther } from "viem";
import { ExplainerCopy } from "~~/components/ExplainerCopy";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const StakingAndWithdrawal = () => {
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "Staker" });
  const refresh = async () => await writeContractAsync({ functionName: "execute" });
  const stakeInEth = async (amount: string): Promise<string> => {
    const result: string = (await writeContractAsync({ functionName: "stake", value: parseEther(amount) })) as string;
    await refresh();
    return result;
  };
  const onWithdraw = async () => {
    await writeContractAsync({ functionName: "withdraw" });
    await refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center" style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
        <h1 className="text-3xl font-bold mb-4">Staking Contract</h1>
        <ExplainerCopy />
      </div>
      <div className="flex items-center flex-row justify-center flex-grow w-full px-4 gap-12">
        <StakingCard stakeInEth={stakeInEth} />
        <Withdrawal onWithdraw={onWithdraw} />
      </div>
    </div>
  );
};
