"use client";

import React from "react";
import { ParticipantsTable } from "./ParticipantsTable";
import { ExplainerCopy } from "~~/components/ExplainerCopy";

export const Participants = () => {
  return (
    <div className="mb-4">
      <div style={{ padding: "2rem" }}>
        <h2 className="text-lg font-bold mb-4">Participants</h2>
        <ExplainerCopy />
      </div>
      <ParticipantsTable />
    </div>
  );
};
