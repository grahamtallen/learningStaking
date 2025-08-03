// SPDX-License-Identifier: MIT
pragma solidity 0.8.20; //Do not change the solidity version as it negatively impacts submission grading

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {

    event Stake(address,uint256);

    ExampleExternalContract public exampleExternalContract;
    mapping (address => uint256 ) public balances;
    uint256 public constant threshold = 1 ether;
    uint256 public deadline = block.timestamp + 45 seconds;
    bool public goalReached = false; // if goal reached, reward is added
    // uint256 public apyBasisPoints = 1000;
    uint256 public apyBasisPoints = 1000000; // TEST
    mapping(address => uint256) public depositTimestamps;


    constructor(address exampleExternalContractAddress) payable {
        exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
    }

    // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
    // (Make sure to add a `Stake(address,uint256)` event and emit it for the frontend `All Stakings` tab to display)
    function stake() public payable {
        balances[msg.sender] += msg.value;
        if (depositTimestamps[msg.sender] == 0) {
            // todo test multiple staking case
            depositTimestamps[msg.sender] = block.timestamp;
        }
        emit Stake(msg.sender, msg.value);
    }
    // After some `deadline` allow anyone to call an `execute()` function
    // If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()`
    function execute() public {
        bool isOverBalance = address(this).balance > threshold;
        if(isOverBalance && timeLeft() == 0) {
            goalReached = true;
        }
    }

    function timeLeft() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }
        else return deadline - block.timestamp;
    }

    function timestampDebug() public view returns (uint256) {
        return block.timestamp;
    }

    function withdraw() public {
        bool balanceExists = balances[msg.sender] != 0;
        require(balanceExists, "Balance is zero");
        if (balanceExists) {
            bool userBalanceIsGreaterThanContractBalance = balances[msg.sender] > address(this).balance;
            require(!userBalanceIsGreaterThanContractBalance, "Something went wrong, user balance is greater than contract balance");
            uint256 currentBalance = balances[msg.sender]; 
            uint256 reward = calculateReward(msg.sender);
            uint256 total = currentBalance + reward;
            uint256 valueToSend = currentBalance;
            if (goalReached) {
                valueToSend = total;
            }
            // prevent re-entry by 0ing out the balance first, then sending.
            balances[msg.sender] = 0;
            (bool sent, bytes memory data) = msg.sender.call{value: valueToSend}("");
            if (!sent) {
                // only re-set the users balance if the call fails
                balances[msg.sender] = currentBalance;
            }
        }
    }

    function calculateReward(address user) public view returns (uint256) {
        uint256 principal = balances[user];
        uint256 start = depositTimestamps[user];
        if (principal == 0 || start == 0) {
            return 0;
        }
        // todo safemath
        uint256 duration = block.timestamp - start;

        uint256 reward = (principal * duration * apyBasisPoints) / (10000 * 365 days);

        return reward;
    }

    function getWithdrawEstimate(address user) external view returns (uint256 stake, uint256 reward, uint256 total) {
        stake = balances[user];
        reward = calculateReward(user);
        total = stake + reward;
    }

    // If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance

    // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend

    // Add the `receive()` special function that receives eth and calls stake()
    receive() external payable {
        stake();
    }
}
