"use client";

import { useState } from "react";
import { EtherInput } from "~~/components/scaffold-eth";

export const StakingInput = ({ onStake }: { onStake: (value: string) => void }) => {
  const [value, setValue] = useState("");
  return (
    <div>
      <EtherInput
        name="stakeAmount"
        placeholder="Enter amount to stake"
        onChange={value => setValue(value)}
        disabled={false}
        usdMode={false}
        value={value}
      />
      <button onClick={() => onStake(value)}>Stake</button>
    </div>
  );
};
