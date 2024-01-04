# Installation
npm install

# Start server
npm start

# Link helpers
Flow - https://github.com/mlabs-haskell/hydra-auction/blob/staging/docs/off_chain_spec.md
Terminology - https://github.com/mlabs-haskell/hydra-auction/blob/staging/docs/domain_logic.md


# TODO
Zod refine on forms
Implement routing from AuctionList to AuctionDetail[`auctionId`] 
Figure out how to discern bidder from seller
Implement AuctionDetail[`auctionId`] - as bidder and seller
Add basic ReactQuery implementation



# States
Times:
    T0 Auction announcement time

    T1 Bidding start time

    T2 Bidding end time

    T3 Voucher expiry time

    T4 Cleanup time

// auctionState.ts
Periods: 
    P0 = [0,  T0) Pre-auction period - `PRE_AUCTION`

    P1 = [T0, T1) Pre-bidding period = `PRE_BIDDING`

    P2 = [T1, T2) Bidding period - `BIDDING`

    P3 = [T2, T3) Voucher active period - `VOUCHER_ACTIVE`

    P4 = [T3, T4) Voucher expired period - `VOUCHER_EXPIRED`

    P5 = [T4,  ∞) Cleanup period - `CLEANUP`

# Flow
A typical workflow for an auction should look as follows:
    The delegates ensure that all daemon services are started (Delegate servers, Hydra nodes).
    Delegates initialize the Hydra Head.
    The seller announces the auction.
    (Bidding start time is reached)
    The seller starts the bidding phase.
    A delegate moves the standing bid to L2.
    The delegates open the Hydra Head.
    Bidders may submit new bids on L2.
    One of the delegates or bidders closes the Hydra Head on L1. The delegates' Hydra nodes continuously monitor L1 for this closing transaction, ready to submit contesting transactions if necessary.
    The seller or one of the bidders or delegates fans out the standing bid to L1.
    (Bidding end time is reached)
    The winning bidder may buy the auction lot.
    (Voucher expiry time is reached)
    If the auction lot has not been bought by the winning bidder, then the seller reclaims the auction lot and may claim the winning bidder’s bidder deposit.
    One of the delegates distributes the auction fees to the delegates.
    (Cleanup time is reached)
    The seller spends the standing bid utxo and burns the voucher token.

# UI 
AS SELLER:
    Announce auction page -> route to AuctionDetail[`auctionId`] 
        AuctionDetail[`auctionId`]
            - Discover bidders button => "discoverBidders()"
            - Authorize bidders -> "authorizeBidders()" Able to show bidders and approve 1 by 1 or approve all?
            - Start bidding button => "startBidding()"

            * Page should show state of auction - enum for auction state based on Perdiod intervals(Prepare, BiddingStart, etc)
            * When active show current bids and their bidders information

            


AS BIDDER:
    
    EnterAuction - maybe from a Navbar to enter auction based on auctionCs -> "EnterAuctionForm"
    
    AuctionList => "queryAuctions()"
        - Click on an auction card -> route to AuctionDetail[`auctionId`] to view or be able to click "Enter Auction" button to apply for participation immediately
        - EnterAuctionForm should be pre-filled with the avail data from the auction was clicked on(maybe greyed out or not even displayed)

    AuctionDetail[`auctionId`] 
        - Enter Auction Button -> allows for bidding on AuctionDetail[`auctionId`] if approved
            - "discoverSellerSignature()" - to get the signature required to bid - (not sure if this should done automatically or will be a button)
            - Layout similar to AS SELLER AuctionDetail[`auctionId`] with less actions - just bidding, viewing auction details
            - When state moves to BiddingEnd - button to buy lot => "bidderBuys()" - this state change should be a notification as well in case bidder is not on app


# Needed endpoints from off_chain_spec.md
 - L2 Endpoints are most of whats missing, otherwise  -- Right now they are focusing on L1 endpoints and getting a full auction flow done on L1. 
 - showUtxos -- No answer yet 
 - showAllUtxos -- No answer yet

 * Is there going to be an endpoint for the state of an auction? Since this will most likely be set and managed by back-end. -- No answer yet



# 12/7
 - Added more apis as fetch endpoints
 - Added utils, time component, and show/hide button components for enterAuction, place bid
 - Added refinement, form now goes to useQuery for enterAuction
 - Implemented the Auction Detail Page 
 - Implemented react query with mutation for the enter auction form so we can see if user has already entered the auction and can now bid
    * We can use this to also see our auctions we are bidding on

# TEST
    - Click Query Auctions in topbar
    - Click on any auction
    - See new auction detail page
    - Click enter auction, scroll down and click submit(the details are auto filled in)
    - You should now see you can place bid on the auction

# Updated Questions 
 - As the bidder, how do we get the bidderVK since it is needed for `enterAuction()` and `discoverSellerSignature()` - both are requirements to place a bid
    * Is it suppose to come from our wallet? Is it unique across auctions? Which endpoint can we get the bidderVk from?

 - All the "would be" number types are strings in types.d.ts
    * Is this correct or will these values come as numbers. This needs to be known if we have to convert the strings to numbers in js.

 - `enterAuction()` parameter `auctionCs` is a singular value, but an `auctionLot` for an auction which the bidder is entering is an array of {`auctionCs`, ...}
    * Since I presume entering the auction you are bidding on the `auctionLot`, how do you enter the auction for an auction with multiple lots and different `auctionCs`?

# 12/14
Is the asset unit the same as the auctionCs?

# 1/2/24
All auctions from queryAuctions have the same auctionId. Why is this?

# 1/3/24
I am using the blockfrost api key thats shown in the hydra-auction-offchain index.js file. Should confirm this is correct and that we shouldnt be generating our own from blockfrost.

The hydra-auction-offchain README states this - 

Note: Blockfrost API key for preprod network can be generated at 
[Blockfrost](https://blockfrost.io/).

QUESTIONS:
If this hasn't already been covered, are we expecting multiple assets for the auction lot. Should we be structuring our code to map over the auctionLot?

TODO: Add ipfs image to AuctionDetail and AnnounceAuction - use an IPFS image component with hook inside
