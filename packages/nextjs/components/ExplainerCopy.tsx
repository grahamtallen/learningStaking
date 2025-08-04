"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { parseTimestamp } from "~~/utils/scaffold-eth";

export const ExplainerCopy = () => {
  const [showDetails, setShowDetails] = useState(false);
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
    <>
      <p className="mb-2">{threshold && deadline && participantsCopy(threshold, deadline)}</p>
      {StakerContract?.address && (
        <span>
          Current cumulative balance:{" "}
          <Balance address={StakerContract?.address} className="px-0 h-1.5 min-h-[0.375rem]" />
        </span>
      )}
      <a onClick={() => setShowDetails(!showDetails)} className="moreinfo">
        more info...
      </a>
      {showDetails && (
        <div>
          <h2 className="text-lg font-bold mb-4">How Staking Works</h2>
          <p className="mb-2">
            Staking allows you to earn rewards by locking up your assets for a period of time. The longer you stake, the
            more you can earn.
          </p>
          <p>
            In this contract, participants must meet a threshold of staked ETH by a specific deadline to be eligible for
            rewards.
          </p>
        </div>
      )}
    </>
  );
};

const participantsCopy = (threshold: bigint, deadline: bigint) => `
    Threshold of: ${formatEther(threshold)} ETH must be met by ${parseTimestamp(deadline)} to withdraw with rewards.
`;
