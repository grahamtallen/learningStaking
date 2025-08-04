"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { IParticipantWithData } from "~~/types/abitype/interfaces";
import { getPercentInterestIncrease, parseGetWithdrawEstimate, weiToEth } from "~~/utils/scaffold-eth";

export const RewardInfoCell = ({ participant }: { participant: IParticipantWithData }) => {
  const { data: getWithDrawestimate } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "getWithdrawEstimate",
    args: [participant.staker],
    watch: true,
  });

  if (!getWithDrawestimate) {
    return <div>Loading...</div>;
  }
  const withdrawEstimate = parseGetWithdrawEstimate(getWithDrawestimate);

  const { stake, reward, total } = withdrawEstimate || {};
  const percentInterestIncrease = getPercentInterestIncrease(stake, reward, total);

  return (
    <span>
      {weiToEth(reward).toFixed(4)} ({percentInterestIncrease.slice(0, 5)})%
    </span>
  );
};
