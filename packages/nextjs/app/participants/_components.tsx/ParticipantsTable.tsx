"use client";

import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { calculateParticipantData } from "~~/utils/scaffold-eth";

export const ParticipantsTable = () => {
    // const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });
    // console.log("StakerContract", StakerContract);
    // debugger;

    const { data: stakeEvents, isLoading } = useScaffoldEventHistory({
        contractName: "Staker",
        eventName: "Stake",
        fromBlock: 0n,
    });
    const participants = stakeEvents ? calculateParticipantData(stakeEvents) : [];

    return (
        <div className="overflow-x-auto">
            Foobar
            <ul className="list-none p-0 m-0">
                {participants?.map((participant, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border-b">
                        <div className="flex flex-row">
                            <BlockieAvatar address={participant.staker} size={30} />
                            <span className="ml-2 mr-1">{participant.staker.slice(0, 6) + "..."}</span>
                            <span>Amount: {participant.stake.toString()}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
