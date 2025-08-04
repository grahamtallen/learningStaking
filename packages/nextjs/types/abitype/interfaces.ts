export interface IGetWithdrawEstimate {
    stake: bigint;
    reward: bigint;
    total: bigint;
}

export interface IStakeEvent {
    staker: string;
    amount: bigint;
    depositTimestamp: bigint;
}

export interface IParticipantWithData {
    staker: string;
    depositTimestamp?: bigint;
    stake: bigint;
    reward?: bigint;
    total?: bigint;
}
