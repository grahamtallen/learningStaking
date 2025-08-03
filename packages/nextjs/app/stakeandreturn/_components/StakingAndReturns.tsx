"use client";

import { useAccount } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const StakingAndReturns = () => {
  const { address: connectedAddress } = useAccount();
  const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });
  const { data: myStake } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "balances",
    args: [connectedAddress],
    watch: true,
  });
  const currentBalance: bigint | undefined = myStake;
  return (
    <div>
      Staker contract address: {StakerContract?.address}
      Currently staked: {currentBalance}
    </div>
  );
};
