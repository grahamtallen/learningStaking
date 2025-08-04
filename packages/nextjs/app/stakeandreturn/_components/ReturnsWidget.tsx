"use client";

import React from "react";

interface IReturnsWidgetProps {
  amount: React.ReactNode | string;
  percent?: string | undefined;
}

export const ReturnsWidget: React.FC<IReturnsWidgetProps> = ({ amount, percent }) => {
  return (
    <div>
      <div>
        <span>{amount}</span>
        <span>+{percent}%</span>
      </div>
    </div>
  );
};
