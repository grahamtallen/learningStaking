"use client";

import Image from "next/image";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { getPercentInterestIncrease, parseTimestamp } from "~~/utils/scaffold-eth";
import { parseGetWithdrawEstimate } from "~~/utils/scaffold-eth";

interface IWithdrawalProps {
  onWithdraw: () => void;
}

export const Withdrawal = ({ onWithdraw }: IWithdrawalProps) => {
  const { address: connectedAddress } = useAccount();
  const { data: goalReached } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "goalReached",
    watch: true,
  });
  const { data: depositTimestamp } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "depositTimestamps",
    args: [connectedAddress],
    watch: true,
  });

  const { data: balance } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "balances",
    watch: true,
    args: [connectedAddress],
  });
  const { data: apyBasisPoints } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "apyBasisPoints",
    // no need to watch, as it is static
  });
  const { data: getWithDrawestimate } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "getWithdrawEstimate",
    args: [connectedAddress],
    watch: true,
  });
  const withdrawalEstimate = parseGetWithdrawEstimate(getWithDrawestimate);
  const { stake, reward, total } = withdrawalEstimate || {};
  const percentInterestIncrease = getPercentInterestIncrease(stake, reward, total);

  const withdrawalClassName = goalReached && balance && balance > 0 ? "readyForWithdrawal" : "disabledNoWithdrawal";
  const image = !goalReached ? "/hold.png" : "/go.png";
  return (
    <div
      className={`${withdrawalClassName} flex flex-col items-center space-y-8 bg-base-100 shadow-lg shadow-primary border-8 border-primary rounded-xl p-6 w-full max-w-lg mt-24`}
    >
      <h2 className="text-xl font-bold">Withdrawal</h2>
      <div className="flex relative w-10 h-10">
        <Image alt="SE2 logo" className="cursor-pointer" fill src={image} />
      </div>
      <p className="text-sm">{goalReached ? "Staking goal reached!" : "Staking goal not reached yet."}</p>
      {withdrawalEstimate && (
        <ul className="text-sm">
          <li>Principal: {formatEther(withdrawalEstimate.stake)}</li>
          <li>
            Interest {getApyString(apyBasisPoints)}: {formatEther(withdrawalEstimate.reward)}{" "}
            {percentInterestIncrease && `(${percentInterestIncrease}%)`}
          </li>
          <li>Total: {withdrawalEstimate.total ? formatEther(withdrawalEstimate.total) : "0"}</li>
          <li>Deposit Timestamp: {parseTimestamp(depositTimestamp)}</li>
        </ul>
      )}
      <button className="btn btn-primary" onClick={onWithdraw} disabled={!goalReached || !balance || balance <= 0}>
        Withdraw
      </button>
    </div>
  );
};

const getApyString = (apyBasisPoints: bigint | undefined): string => {
  if (!apyBasisPoints) return "0%";
  const apy = Number(apyBasisPoints) / 100; // Convert basis points to percentage
  return `(${apy.toFixed(2)}% APY)`;
};
