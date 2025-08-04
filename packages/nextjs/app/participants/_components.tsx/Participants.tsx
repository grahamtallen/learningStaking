"use client";

import React from "react";
import { ParticipantsTable } from "./ParticipantsTable";

export const Participants = () => {

    return (
        <div className="mb-4">
            <div>
                <h2 className="text-lg font-bold mb-4">Participants</h2>
                <p className="mb-2">{participantsCopy("0.5")}</p>
            </div>
            <ParticipantsTable />
        </div>
    );
}

const participantsCopy = (threshold: string) => `
    Threshold of: ${threshold} must be met to with draw with rewards.
`