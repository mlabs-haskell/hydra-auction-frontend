# Setup for Development

## Pre-Installation
Set required environment variables for offchain library installation:
```
export NPM_ENV=1
export CARDANO_NETWORK=preprod
export BLOCKFROST_API_KEY=<your key>
export PLUTIP_ENV_HOST_PORT=localhost:8083 
export DEMO_HOST_PORT=localhost:8080
```
These will often get overwritten. If the install isn't working, make sure these are still set with `echo`.

## Installation
`npm install`

## Configuration
Before you run the server, make sure you set your blockfrost api key in an env file

```BLOCKFROST_API_KEY=<your key>```

## Start server
`npm start`

# About the App
## Specifications
- Flow - https://github.com/mlabs-haskell/hydra-auction/blob/staging/docs/off_chain_spec.md
- Terminology - https://github.com/mlabs-haskell/hydra-auction/blob/staging/docs/domain_logic.md
- UX - https://github.com/mlabs-haskell/hydra-auction-frontend/blob/master/docs/ux_flow_spec.md

## Understanding States
### Times
- T0 Auction announcement time

- T1 Bidding start time

- T2 Bidding end time

- T3 Voucher expiry time

- T4 Cleanup time

### auctionState.ts Periods: 

    P0 = [0,  T0) Pre-auction period - `PRE_AUCTION`

    P1 = [T0, T1) Pre-bidding period = `PRE_BIDDING`

    P2 = [T1, T2) Bidding period - `BIDDING`

    P3 = [T2, T3) Voucher active period - `VOUCHER_ACTIVE`

    P4 = [T3, T4) Voucher expired period - `VOUCHER_EXPIRED`

    P5 = [T4,  ∞) Cleanup period - `CLEANUP`

# Flow
A typical workflow for an auction should look as follows:

- The delegates ensure that all daemon services are started (Delegate servers, Hydra nodes).
- Delegates initialize the Hydra Head.
- The seller announces the auction.
- (Bidding start time is reached)
- The seller starts the bidding phase.
- A delegate moves the standing bid to L2.
  - The delegates open the Hydra Head. Bidders may submit new bids on L2.  
- One of the delegates or bidders closes the Hydra Head on L1. The delegates' Hydra nodes continuously monitor L1 for this closing transaction, ready to submit contesting transactions if necessary.
  - The seller or one of the bidders or delegates fans out the standing bid to L1.
- (Bidding end time is reached)
- The winning bidder may buy the auction lot.
- (Voucher expiry time is reached)
- If the auction lot has not been bought by the winning bidder, then the seller reclaims the auction lot and may claim the winning bidder’s bidder deposit.
- One of the delegates distributes the auction fees to the delegates.
- (Cleanup time is reached)
- The seller spends the standing bid utxo and burns the voucher token.

# UI 
AS SELLER:
- Announce auction page -> route to AuctionDetail[`auctionId`] 
  - AuctionDetail[`auctionId`]
    - Discover bidders button => "discoverBidders()"
    - Authorize bidders -> "authorizeBidders()" Able to show bidders and approve 1 by 1 or approve all?
    - Start bidding button => "startBidding()"

  - Page should show state of auction - enum for auction state based on Perdiod intervals(Prepare, BiddingStart, etc)
  - When active show current bids and their bidders information

AS BIDDER:
    
- EnterAuction - maybe from a Navbar to enter auction based on auctionCs -> "EnterAuctionForm"  
- AuctionList => "queryAuctions()"
  - Click on an auction card -> route to AuctionDetail[`auctionId`] to view or be able to click "Enter Auction" button to apply for participation immediately
- EnterAuctionForm should be pre-filled with the avail data from the auction that was clicked on(maybe greyed out or not even displayed)

- AuctionDetail[`auctionId`] 
  - Enter Auction Button -> allows for bidding on AuctionDetail[`auctionId`] if approved
  - "discoverSellerSignature()" - to get the signature required to bid - (not sure if this should done automatically or will be a button)
  - Layout similar to AS SELLER AuctionDetail[`auctionId`] with less actions - just bidding, viewing auction details
  - When state moves to BiddingEnd - button to buy lot => "bidderBuys()" - this state change should be a notification as well in case bidder is not on app