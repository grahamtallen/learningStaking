"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
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
  const { data: goalReached } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "goalReached",
  });
  const { data: totalStaked } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "totalStaked",
    watch: true,
  });
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "Staker" });
  const refresh = async () => await writeContractAsync({ functionName: "execute" });
  return (
    <>
      {!goalReached ? (
        <div
          style={{ width: "70vw" }}
          className="flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4"
        >
          <p className="mb-2">{threshold && deadline && participantsCopy(threshold, deadline)}</p>
          {StakerContract?.address && (
            <span>Current contract balance: {totalStaked && formatEther(totalStaked)} ETH</span>
          )}
          <a onClick={() => setShowDetails(!showDetails)} className="moreinfo">
            more info...
          </a>
          {showDetails && (
            <div>
              <h2 className="text-lg font-bold mb-4">How Staking Works</h2>
              <p className="mb-2">
                Staking allows you to earn rewards by locking up your assets for a period of time. The longer you stake,
                the more you can earn.
              </p>
              <p>
                In this contract, participants must meet a threshold of staked ETH by a specific deadline to be eligible
                for rewards. Withdrawing without hitting the goal will not yield any rewards, you will only get your
                principal back.
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="mb-2">Staking goal reached! You can now withdraw your staked ETH and rewards.</p>
      )}
      <button className="btn btn-primary" onClick={() => refresh()}>
        Refresh
      </button>
    </>
  );
};

const participantsCopy = (threshold: bigint, deadline: bigint) => `
    Threshold of: ${formatEther(threshold)} ETH must be met by ${parseTimestamp(deadline)} to withdraw with rewards.
`;
