"use client";

export const ReturnsWidget = ({
    amount,
    percent,
    title
}) => {
  return (
    <div>
        <div>
            <span>{amount}</span><span>+{percent}%</span>
        </div>
        <h3>{title}</h3>
    </div>
  )
}
