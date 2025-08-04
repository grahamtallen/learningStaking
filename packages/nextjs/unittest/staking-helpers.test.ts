import {
  calculateParticipantData,
  getPercentInterestIncrease,
  parseGetWithdrawEstimate,
  parseTimestamp,
} from "../utils/scaffold-eth/staking-helpers";

describe("Staking Helpers", () => {
  describe("getPercentInterestIncrease", () => {
    it("should calculate the correct percentage increase", () => {
      const stake = BigInt(1000);
      const reward = BigInt(200);
      const total = BigInt(1200);
      const result = getPercentInterestIncrease(stake, reward, total);
      expect(result).toEqual("20.000000");
    });

    it("should return 0% when stake is 0", () => {
      const stake = BigInt(0);
      const reward = BigInt(0);
      const total = BigInt(0);
      const result = getPercentInterestIncrease(stake, reward, total);
      expect(result).toEqual("0");
    });

    it("divide by zero protection", () => {
      const stake = BigInt(200);
      const reward = BigInt(100);
      const total = BigInt(0);
      const result = getPercentInterestIncrease(stake, reward, total);
      expect(result).toEqual("0");
    });
  });

  describe("parseGetWithdrawEstimate", () => {
    it("should parse withdrawal estimate correctly", () => {
      const estimate = [BigInt(1000), BigInt(200), BigInt(1200)] as readonly [bigint, bigint, bigint];
      const result = parseGetWithdrawEstimate(estimate);
      expect(result).toEqual({
        stake: BigInt(1000),
        reward: BigInt(200),
        total: BigInt(1200),
      });
    });
  });

  describe("calculateParticipantData", () => {
    it("should calculate participant data from stake events", () => {
      const stakeEvents = [
        { args: { staker: "0x1", amount: BigInt(1000), depositTimestamp: BigInt(1620000000) } },
        { args: { staker: "0x2", amount: BigInt(2000), depositTimestamp: BigInt(1530000001) } },
      ];
      const result = calculateParticipantData(stakeEvents);
      expect(result).toEqual([
        {
          staker: "0x1",
          depositTimestamp: BigInt(1620000000),
          stake: BigInt(1000),
          reward: BigInt(0),
          total: BigInt(0),
        },
        {
          staker: "0x2",
          depositTimestamp: BigInt(1530000001),
          stake: BigInt(2000),
          reward: BigInt(0),
          total: BigInt(0),
        },
      ]);
    });
  });

  describe("parseTimestamp", () => {
    it("should parse timestamp correctly", () => {
      const timestamp = BigInt(1620000000);
      const result = parseTimestamp(timestamp);
      expect(result).toEqual(new Date(Number(timestamp) * 1000).toLocaleString());
    });

    it("should return 'N/A' for undefined timestamp", () => {
      const result = parseTimestamp(undefined);
      expect(result).toEqual("N/A");
    });
  });
});
