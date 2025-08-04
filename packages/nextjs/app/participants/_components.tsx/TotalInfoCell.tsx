"use client";

import { formatEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { IParticipantWithData } from "~~/types/abitype/interfaces";
import { parseGetWithdrawEstimate } from "~~/utils/scaffold-eth";

export const TotalInfoCell = ({ participant }: { participant: IParticipantWithData }) => {
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

  const { total } = withdrawEstimate || {};
  if (total === BigInt(0)) {
    return <div className="text-gray-500">(Funds withdrawn)</div>;
  }

  return formatEther(total);
};
