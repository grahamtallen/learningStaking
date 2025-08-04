import { IGetWithdrawEstimate, IParticipantWithData, IStakeEvent } from "~~/types/abitype/interfaces";

export const weiToEth = (wei: bigint) => Number(wei) / 1e18;

export const parseGetWithdrawEstimate = (res: readonly [bigint, bigint, bigint] | undefined): IGetWithdrawEstimate => {
  if (!res || res.length < 2) {
    return { stake: BigInt(0), reward: BigInt(0), total: BigInt(0) };
  }
  return {
    stake: res[0] ?? BigInt(0),
    reward: res[1] ?? BigInt(0),
    total: res[2] ?? BigInt(0),
  };
};

export const getPercentInterestIncrease = (stake: bigint, reward: bigint, total: bigint): string => {
  if (!stake || !reward || !total) return "0";
  const ethTotal = weiToEth(total);
  const ethStake = weiToEth(stake);
  return Number(((ethTotal - ethStake) / ethStake) * 100).toFixed(6);
};

export const parseStakeEvent = (event: any): IStakeEvent => {
  if (!event || !event.args) {
    return { staker: "", depositTimestamp: BigInt(0), amount: BigInt(0) };
  }
  const stakeEvent: IStakeEvent = event.args as IStakeEvent;
  return {
    staker: stakeEvent.staker,
    amount: stakeEvent.amount,
    depositTimestamp: stakeEvent.depositTimestamp,
  };
};

// should be done in subgraph or somewhere off-chain
// iterate through each stake event
// and calculate the total stake, reward, and total for each participant
export const calculateParticipantData = (stakeEvents: any[]): IParticipantWithData[] => {
  return stakeEvents.map(event => {
    const { staker, amount, depositTimestamp } = parseStakeEvent(event);
    return {
      staker,
      depositTimestamp,
      stake: amount,
      reward: BigInt(0),
      total: BigInt(0),
    };
  });
};

export const parseTimestamp = (timestamp: bigint | undefined): string => {
  if (!timestamp) return "N/A";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
};
