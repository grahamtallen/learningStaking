"use client";

import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const ParticipantsTable = () => {
  const { data: StakerContract } = useDeployedContractInfo({ contractName: "Staker" });
  console.log("StakerContract", StakerContract);
  debugger;

  const { data: participants } = useScaffoldReadContract({
    contractName: "Staker",
    functionName: "getAllParticipants",
    watch: true,
  });
  return (
    <div className="overflow-x-auto">
      Foobar
      <ul className="list-none p-0 m-0">
        {participants?.map((participant, index) => (
          <li key={index} className="flex justify-between items-center p-2 border-b">
            <div className="flex flex-row">
              <BlockieAvatar address={participant} size={30} />
              <span className="ml-2 mr-1">{participant?.slice(0, 6) + "..."}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
