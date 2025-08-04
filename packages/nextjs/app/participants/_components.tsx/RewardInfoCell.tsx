"use client";

import { formatEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { IParticipantWithData } from "~~/types/abitype/interfaces";
import { parseGetWithdrawEstimate } from "~~/utils/scaffold-eth";

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

    return (
        <div className="flex flex-col items-center">
            <div>Interest: {formatEther(withdrawEstimate.reward)}</div>
            <div>Total: {formatEther(withdrawEstimate.total)}</div>
        </div>
    );
}