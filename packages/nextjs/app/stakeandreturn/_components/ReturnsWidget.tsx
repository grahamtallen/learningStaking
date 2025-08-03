"use client";

import React from "react";

interface IReturnsWidgetProps {
  amount: React.ReactNode | string;
  percent?: string | undefined;
  title: string;
}

export const ReturnsWidget: React.FC<IReturnsWidgetProps> = ({ amount, percent, title }) => {
  return (
    <div>
      <h3>{title}</h3>
      <div>
        <span>{amount}</span>
        <span>+{percent}%</span>
      </div>
    </div>
  );
};
