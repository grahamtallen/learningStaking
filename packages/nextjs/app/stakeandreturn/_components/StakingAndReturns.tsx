"use client";

import { ReturnsWidget } from "./ReturnsWidget";
import { StakingInput } from "./StakingInput";
import { Withdrawal } from "./Withdrawal";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { ETHToPrice } from "~~/app/staker-ui/_components";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { IGetWithdrawEstimate } from "~~/types/abitype/interfaces";
import { weiToEth } from "~~/utils/scaffold-eth";

export const StakingAndReturns = () => {
  const { address: connectedAddress } = useAccount();
  const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "Staker" });
  const refresh = async () => await writeContractAsync({ functionName: "execute" });
  const stakeInEth = async (amount: string) => {
    await writeContractAsync({ functionName: "stake", value: parseEther(amount) });
    await refresh();
  };
  const onWithdraw = async () => {
    await writeContractAsync({ functionName: "withdraw" });
    await refresh();
  };

  const { data: getWithDrawestimate } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "getWithdrawEstimate",
    args: [connectedAddress],
    watch: true,
  });
  const withdrawEstimate = parseGetWithdrawEstimate(getWithDrawestimate);
  const { stake, reward, total } = withdrawEstimate;
  const percentInterestIncrease = getPercentInterestIncrease(stake, reward, total);

  return (
    <div className="flex items-center flex-row justify-center flex-grow w-full px-4 gap-12">
      <div
        className={`flex flex-col items-center space-y-8 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg mt-24`}
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
      <Withdrawal onWithdraw={onWithdraw} withdrawalEstimate={withdrawEstimate} />
      <br />
    </div>
  );
};

const parseGetWithdrawEstimate = (res: readonly [bigint, bigint, bigint] | undefined): IGetWithdrawEstimate => {
  if (!res || res.length < 3) {
    return { stake: BigInt(0), reward: BigInt(0), total: BigInt(0) };
  }
  return {
    stake: res[0] ?? BigInt(0),
    reward: res[1] ?? BigInt(0),
    total: res[2] ?? BigInt(0),
  };
};
const getPercentInterestIncrease = (stake: bigint, reward: bigint, total: bigint): string => {
  if (!stake || !reward || !total) return "0"; // prevent div by zero
  const ethTotal = weiToEth(total);
  const ethStake = weiToEth(stake);
  return Number(((ethTotal - ethStake) / ethStake) * 100).toFixed(6);
};
