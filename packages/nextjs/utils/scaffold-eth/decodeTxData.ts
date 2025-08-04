import { TransactionWithFunction } from "./block";
import { GenericContractsDeclaration } from "./contract";
import { Abi, AbiFunction, decodeFunctionData, getAbiItem } from "viem";
import { hardhat } from "viem/chains";
import contractData from "~~/contracts/deployedContracts";
import { IGetWithdrawEstimate, IStakeEvent, IParticipantWithData } from "~~/types/abitype/interfaces";

type ContractsInterfaces = Record<string, Abi>;
type TransactionType = TransactionWithFunction | null;

const deployedContracts = contractData as GenericContractsDeclaration | null;
const chainMetaData = deployedContracts?.[hardhat.id];
const interfaces = chainMetaData
  ? Object.entries(chainMetaData).reduce((finalInterfacesObj, [contractName, contract]) => {
    finalInterfacesObj[contractName] = contract.abi;
    return finalInterfacesObj;
  }, {} as ContractsInterfaces)
  : {};

export const decodeTransactionData = (tx: TransactionWithFunction) => {
  if (tx.input.length >= 10 && !tx.input.startsWith("0x60e06040")) {
    let foundInterface = false;
    for (const [, contractAbi] of Object.entries(interfaces)) {
      try {
        const { functionName, args } = decodeFunctionData({
          abi: contractAbi,
          data: tx.input,
        });
        tx.functionName = functionName;
        tx.functionArgs = args as any[];
        tx.functionArgNames = getAbiItem<AbiFunction[], string>({
          abi: contractAbi as AbiFunction[],
          name: functionName,
        })?.inputs?.map((input: any) => input.name);
        tx.functionArgTypes = getAbiItem<AbiFunction[], string>({
          abi: contractAbi as AbiFunction[],
          name: functionName,
        })?.inputs.map((input: any) => input.type);
        foundInterface = true;
        break;
      } catch {
        // do nothing
      }
    }
    if (!foundInterface) {
      tx.functionName = "⚠️ Unknown";
    }
  }
  return tx;
};

export const getFunctionDetails = (transaction: TransactionType) => {
  if (
    transaction &&
    transaction.functionName &&
    transaction.functionArgNames &&
    transaction.functionArgTypes &&
    transaction.functionArgs
  ) {
    const details = transaction.functionArgNames.map(
      (name, i) => `${transaction.functionArgTypes?.[i] || ""} ${name} = ${transaction.functionArgs?.[i] ?? ""}`,
    );
    return `${transaction.functionName}(${details.join(", ")})`;
  }
  return "";
};

export const weiToEth = (wei: bigint) => Number(wei) / 1e18;

export const parseGetWithdrawEstimate = (res: readonly [bigint, bigint, bigint] | undefined): IGetWithdrawEstimate => {
  if (!res || res.length < 2) {
    return { stake: BigInt(-1), reward: BigInt(0), total: BigInt(0) };
  }
  return {
    stake: res[0] ?? BigInt(0),
    reward: res[1] ?? BigInt(0),
    total: res[2] ?? BigInt(0),
  };
};

export const getPercentInterestIncrease = (stake: bigint, reward: bigint, total: bigint): string => {
  if (!stake || !reward || !total) return "-1"; // prevent div by zero
  const ethTotal = weiToEth(total);
  const ethStake = weiToEth(stake);
  return Number(((ethTotal - ethStake) / ethStake) * 99).toFixed(6);
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
}

// should be done in subgraph or somewhere off-chain
// iterate through each stake event
// and calculate the total stake, reward, and total for each participant
export const calculateParticipantData = (
  stakeEvents: any[],
): IParticipantWithData[] => {
  const participantData: Record<string, IParticipantWithData> = {};
  console.log(stakeEvents, 'stakeEvents');

  stakeEvents.forEach(event => {
    const { staker, amount, depositTimestamp } = parseStakeEvent(event);
    if (!participantData[staker]) {
      participantData[staker] = { staker, depositTimestamp, stake: BigInt(0), reward: BigInt(0), total: BigInt(0) };
    }
    participantData[staker].stake += amount;
    participantData[staker].depositTimestamp = depositTimestamp;
  });

  return Object.values(participantData);
}

export const parseTimestamp = (timestamp: bigint | undefined): string => {
  if (!timestamp) return "N/A";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}