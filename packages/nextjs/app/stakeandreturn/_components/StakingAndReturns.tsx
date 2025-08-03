"use client";

import { useAccount } from "wagmi";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ReturnsWidget } from "./ReturnsWidget";
import { ETHToPrice } from "~~/app/staker-ui/_components";
import { formatEther } from "viem";
export const StakingAndReturns = () => {
  const { address: connectedAddress } = useAccount();
  const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });

  const { data: getWithDrawestimate} = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "getWithdrawEstimate",
    args: [connectedAddress],
    watch: true,
  });
  console.log("getWithdraw", getWithDrawestimate)
  let stake;
  let reward;
  let total;
  let percentInterestIncrease;
  if (getWithDrawestimate) {
    stake = getWithDrawestimate[0];
    reward = getWithDrawestimate[1];
    total = getWithDrawestimate[2];
    percentInterestIncrease = getPercentInterestIncrease(stake, reward, total);
  }
  
  
  return (
    <div>
      Staker contract address: {StakerContract?.address}
      <ReturnsWidget
        title="Staked"
        amount={total ? <ETHToPrice value={formatEther(total)} /> : ''}
        percent={percentInterestIncrease}
      />
    </div>
  );
};

const getPercentInterestIncrease = (stake:bigint, reward: bigint, total: bigint) => {
    if (!stake || !reward || !total) return 0; // prevent div by zero
    const ethTotal = weiToEth(total);
    const ethStake = weiToEth(stake);
    return Number(((ethTotal - ethStake)/ethStake) * 100).toFixed(6);
}

const weiToEth = (wei: bigint) => Number(wei) / 1e18