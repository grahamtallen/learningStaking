"use client";

import React from "react";
import { ParticipantsTable } from "./ParticipantsTable";
import { formatEther } from "viem";
import { Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseTimestamp } from "~~/utils/scaffold-eth";

export const Participants = () => {
  // Get some data for context for participants about how staking works
  const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });
  const { data: threshold } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "threshold",
  });
  const { data: deadline } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "deadline",
  });

  return (
    <div className="mb-4">
      <div>
        <h2 className="text-lg font-bold mb-4">Participants</h2>
        <p className="mb-2">{threshold && deadline && participantsCopy(threshold, deadline)}</p>
        {StakerContract?.address && (
          <span>
            Current cumulative balance:{" "}
            <Balance address={StakerContract?.address} className="px-0 h-1.5 min-h-[0.375rem]" />
          </span>
        )}
      </div>
      <ParticipantsTable />
    </div>
  );
};

const participantsCopy = (threshold: bigint, deadline: bigint) => `
    Threshold of: ${formatEther(threshold)} ETH must be met by ${parseTimestamp(deadline)} to withdraw with rewards.
`;
