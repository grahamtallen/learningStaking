"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const Withdrawal = ({ onWithdraw }: { onWithdraw: () => void }) => {
  const { address: connectedAddress } = useAccount();
  const { data: goalReached } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "goalReached",
    watch: true,
  });
  const { data: balance } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "balances",
    watch: true,
    args: [connectedAddress],
  });
  const withdrawalClassName = goalReached && balance && balance > 0 ? "readyForWithdrawal" : "disabledNoWithdrawal";
  return (
    <div
      className={`${withdrawalClassName} flex flex-col items-center space-y-8 bg-base-100 shadow-lg shadow-primary border-8 border-primary rounded-xl p-6 w-full max-w-lg mt-24`}
    >
      <h2 className="text-xl font-bold">Withdrawal</h2>
      <button className="btn btn-primary" onClick={onWithdraw} disabled={!goalReached || !balance || balance <= 0}>
        Withdraw
      </button>
    </div>
  );
};
