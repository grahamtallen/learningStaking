"use client";

import React from "react";
import { StakingInput } from "./StakingInput";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface IStakingCardProps {
  stakeInEth: (amount: string) => Promise<string>;
}

export const StakingCard = ({ stakeInEth }: IStakingCardProps) => {
  const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });
  const [value, setValue] = React.useState<string>("");
  const [successfulTrx, setSuccessfulTrx] = React.useState<string | null>(null);
  const onStake = async (value: string) => {
    try {
      const result = await stakeInEth(value);
      setValue(value);
      setSuccessfulTrx(result);
    } catch (error) {
      console.error("Error staking:", error);
      setSuccessfulTrx(null);
    }
  };
  return (
    <div
      className={`flex flex-col items-center space-y-9 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg mt-24`}
    >
      <h1 className="text-2xl font-bold">Staking</h1>
      <br />
      <StakingInput onStake={onStake} />
      {successfulTrx && (
        <span>
          ✅ Successfully staked {value} ETH! Transaction hash: <pre style={{ fontSize: "8px" }}>{successfulTrx}</pre>
        </span>
      )}
      <br />
      Staker contract address: {StakerContract?.address}
    </div>
  );
};
