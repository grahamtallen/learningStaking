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
    bool public openForWithdraw = false;


    constructor(address exampleExternalContractAddress) {
        exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
    }

    // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
    // (Make sure to add a `Stake(address,uint256)` event and emit it for the frontend `All Stakings` tab to display)
    function stake() public payable {
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }
    // After some `deadline` allow anyone to call an `execute()` function
    // If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()`
    function execute() public {
        if(!exampleExternalContract.completed() && timeLeft() == 0) {
            bool isOverBalance = address(this).balance > threshold;
            if (isOverBalance) {
                exampleExternalContract.complete();
            } else {
                openForWithdraw = true;
            }
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
        require(openForWithdraw, "Not open for withdrawal");
        bool balanceExists = balances[msg.sender] != 0;
        require(balanceExists, "Balance is zero");
        if (balanceExists) {
            bool userBalanceIsGreaterThanContractBalance = balances[msg.sender] > address(this).balance;
            require(!userBalanceIsGreaterThanContractBalance, "Something went wrong, user balance is greater than contract balance");
            // prevent re-entry by 0ing out the balance first, then sending.
            uint256 currentBalance = balances[msg.sender]; 
            balances[msg.sender] = 0;
            (bool sent, bytes memory data) = msg.sender.call{value: currentBalance}("");
            if (!sent) {
                // only re-set the users balance if the call fails
                balances[msg.sender] = currentBalance;
            }
        }
    }

    // If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance

    // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend

    // Add the `receive()` special function that receives eth and calls stake()
    receive() external payable {
        stake();
    }
}
