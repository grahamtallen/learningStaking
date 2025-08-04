export interface IGetWithdrawEstimate {
  stake: bigint;
  reward: bigint;
  total: bigint;
}

export interface ParticipantWithData {
  address: string;
  balance?: bigint;
  depositTimestamp?: bigint;
  stake?: bigint;
  reward?: bigint;
  total?: bigint;
}
