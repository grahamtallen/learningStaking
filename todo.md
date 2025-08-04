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
- [x] Staked amount should automatically update after successful stake
- [x] Display calculated reward
- [x] Display total if withdrawn (post goal reached)
- [x] Stoplight ui listen for goal reached event
- [x] Move percent calculated to withdrawal card
- [x] Show successful trx info after stake

## Phase 3: Lightweight Admin Interface

- [ ] Add `Ownable` or equivalent ownership check
- [ ] Add `setApyBasisPoints(uint256)` function
- [ ] Show simple admin form if user is contract owner

## Optional Stretch Goals

- [ ] Track and store list of all stakers
    - [x] Refactor to use event history rather than tracking participants in an array
    - [ ] Stretch goal try subgraph - optimized for events
    - [xx] Listen for stake events and auto update participants table
    - [x] For the purposes of the demo only allow one stake per user
    - [x] Read real threshold value from contract on participants page
    - [x] show if contract has met threshold
    - [x] show apy rewards
    - [x] show interest percentages in table
    - [x] show if users have withdrawn funds yet
    - [ ] show date diff
- [x] Explainer copy
- [x] Display all stakers with their stakes and reward estimates in admin UI
- [ ] Ensure solidity math is safe, pentest
- [ ] goalReached logic safety
- [ ] Is there a way to avoid the frontend having to call execute?
- [ ] APY is not calculated accurately with multiple stakes enabled

## Bugs & warnings

- [ ] ./app/participants/_components.tsx/ParticipantsTable.tsx
17:9  Warning: The 'participants' conditional could make the dependencies of useMemo Hook (at line 31) change on every render. Move it inside the useMemo callback. Alternatively, wrap the initialization of 'participants' in its own useMemo() Hook.  react-hooks/exhaustive-deps
- [ ] Solidity warnings