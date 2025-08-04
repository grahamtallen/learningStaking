"use client";

import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { calculateParticipantData } from "~~/utils/scaffold-eth";
import { SortableTable } from "./SortableTable";

export const ParticipantsTable = () => {

    const { data: stakeEvents } = useScaffoldEventHistory({
        contractName: "Staker",
        eventName: "Stake",
        fromBlock: 0n,
    });
    const participants = stakeEvents ? calculateParticipantData(stakeEvents) : [];

    return (
        <div className="overflow-x-auto">
            <SortableTable data={participants} />
        </div>
    );
};
