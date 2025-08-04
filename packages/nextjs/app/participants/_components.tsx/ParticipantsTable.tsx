"use client";

import React from "react";
import { SortableTable } from "./SortableTable";
import { useScaffoldEventHistory, useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { IParticipantWithData } from "~~/types/abitype/interfaces";
import { calculateParticipantData } from "~~/utils/scaffold-eth";

// todo: too much array iterations in this file, figure out pagination of events or subgraph
export const ParticipantsTable = () => {
  const [newParticipantsData, setNewParticipantsData] = React.useState<IParticipantWithData[]>([]);
  const { data: stakeEvents } = useScaffoldEventHistory({
    contractName: "Staker",
    eventName: "Stake",
    fromBlock: 0n,
  });
  const participants = stakeEvents ? calculateParticipantData(stakeEvents) : [];

  useScaffoldWatchContractEvent({
    contractName: "Staker",
    eventName: "Stake",
    onLogs: event => {
      const newParticipants = calculateParticipantData(event);
      setNewParticipantsData(prev => [...newParticipants, ...prev]);
    },
  });

  // listen for any new events and update participants
  const participantsData = React.useMemo(() => {
    return [...newParticipantsData, ...participants];
  }, [participants, newParticipantsData]);

  return (
    <div className="overflow-x-auto" style={{ padding: "2rem" }}>
      <SortableTable data={participantsData} />
    </div>
  );
};
