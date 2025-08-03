# Decentralized Staking Extension — TODO List

## Phase 1: Core Contract + APY Logic

- [x] Add `apyBasisPoints` state variable
- [x] Track user stake timestamps with `depositTimestamps`
- [x] Set timestamp and update balance in `stake()` if first stake
- [x] Add `calculateReward(address user)` view function
- [x] Add `getWithdrawEstimate(address user)` view function
- [x] Update `withdraw()` to return stake + reward and reset tracking

## Phase 2: User Dashboard (Frontend)

- [x] Display user’s staked amount
- [x] Enter stake amount and execute
- [ ] Staked amount should automatically update after successful stake
- [ ] Display calculated reward
- [ ] Display total if withdrawn (post goal reached)
- [ ] Show fallback estimate if threshold not yet met
- [ ] Stoplight ui listen for goal reached event

## Phase 3: Lightweight Admin Interface

- [ ] Add `Ownable` or equivalent ownership check
- [ ] Add `setApyBasisPoints(uint256)` function
- [ ] Show simple admin form if user is contract owner

## Optional Stretch Goals

- [ ] Track and store list of all stakers
- [ ] Display all stakers with their stakes and reward estimates in admin UI
- [ ] Ensure solidity math is safe, pentest
- [ ] goalReached logic safety