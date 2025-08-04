"use client";

import { SortableTable } from "./SortableTable";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { calculateParticipantData } from "~~/utils/scaffold-eth";

export const ParticipantsTable = () => {
  const { data: stakeEvents } = useScaffoldEventHistory({
    contractName: "Staker",
    eventName: "Stake",
    fromBlock: 0n,
  });
  const participants = stakeEvents ? calculateParticipantData(stakeEvents) : [];

  return (
    <div className="overflow-x-auto" style={{ padding: "2rem" }}>
      <SortableTable data={participants} />
    </div>
  );
};
