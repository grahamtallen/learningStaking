"use client";

import { useState } from "react";
import { EtherInput } from "~~/components/scaffold-eth";

export const StakingInput = ({ onStake }: { onStake: (value: string) => void }) => {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col items-center">
      <EtherInput
        name="stakeAmount"
        placeholder="Enter amount to stake"
        onChange={value => setValue(value)}
        disabled={false}
        usdMode={false}
        value={value}
      />
      <button
        disabled={value === ""}
        style={{ marginTop: "1rem" }}
        className="btn btn-primary"
        onClick={() => onStake(value)}
      >
        Stake
      </button>
    </div>
  );
};
