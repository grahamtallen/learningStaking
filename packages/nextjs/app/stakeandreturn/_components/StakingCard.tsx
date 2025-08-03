"use client";

import { ReturnsWidget } from "./ReturnsWidget";
import { StakingInput } from "./StakingInput";
import { formatEther } from "viem";
import { ETHToPrice } from "~~/app/staker-ui/_components";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { IGetWithdrawEstimate } from "~~/types/abitype/interfaces";
import { getPercentInterestIncrease } from "~~/utils/scaffold-eth";

interface IStakingCardProps {
  stakeInEth: (amount: string) => void;
  withdrawalEstimate: IGetWithdrawEstimate;
}

export const StakingCard = ({ stakeInEth, withdrawalEstimate }: IStakingCardProps) => {
  const { stake, reward, total } = withdrawalEstimate;
  const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });
  const percentInterestIncrease = getPercentInterestIncrease(stake, reward, total);
  return (
    <div
      className={`flex flex-col items-center space-y-9 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg mt-24`}
    >
      <h1 className="text-2xl font-bold">Staking</h1>
      <ReturnsWidget
        amount={total ? <ETHToPrice className="inline" value={formatEther(total)} /> : ""}
        percent={percentInterestIncrease}
      />
      <br />
      <StakingInput onStake={value => stakeInEth(value)} />
      <br />
      Staker contract address: {StakerContract?.address}
    </div>
  );
};
