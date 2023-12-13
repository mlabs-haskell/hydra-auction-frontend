# User Lifecycles

## Types of Users

- Sellers
- Bidders
	- Winner
	- Losers
- Delegates

## Auction Lifecycle

### States from a User perspective

- ∅ (Unannounced)
- Announced 
- Ongoing
	- Bidding on L1
	- Bidding on L2
- Resolution
	- Voucher Active
	- Voucher Expired
- Concluded


## Auction state machine
(copied from https://github.com/mlabs-haskell/hydra-auction/blob/c3169e8cd531225412c7b09cc4687fdded9b0e6a/docs/domain_logic.md)

An auction can be modelled by the following state machine.
Here we use the UML statechart formalism,
whereby each transition is labelled as
`input [condition]`.
A conjunction of multiple conditions is labelled
as `[condition1, condition2, ...]`.
We omit the outputs of each state transition.

```mermaid
stateDiagram-v2
  [*]           -->   Announced:     AnnounceAuction [P0]
  Announced     -->   BiddingOnL1:   StartBidding [P2]
  BiddingOnL1   -->   BiddingOnL2:   CommitStandingBid [P2, HI]
  BiddingOnL1   -->   Purchase:      [P3]
  BiddingOnL2   -->   BiddingOnL1:   FanoutStandingBid [P2]
  BiddingOnL2   -->   Purchase:      FanoutStandingBid [P3]
  Purchase      -->   Concluded:     BidderBuys [P3]
  Purchase      -->   Penalty:       [P4]
  Penalty       -->   Concluded:     SellerReclaims [P4 ∪ P5]
  Concluded     -->   [*]:           Cleanup [P5]
```

The state transitions are as follows:

<table><tr><td>

`AnnounceAuction [P0]`. Before the auction announcement time `T0`,
the seller can announce the auction via an L1 blockchain transaction
that locks the auction lot into the auction escrow
and specifies the terms of the auction.

</td></tr><tr></tr><tr><td>

`StartBidding [P2]`. During the bidding period
(preferrably at the bidding start `T1`),
the seller can declare the list of approved bidders for the auction
and initialize the standing bid for the auction,
which allows these bidders to start placing bids in the auction
via L1 transactions.

</td></tr><tr></tr><tr><td>

`CommitStandingBid [P2, HI]`. During the bidding period,
if the Hydra Head that will host the auction is still initializing (`HI`),
then the standing bid can be moved to the Hydra Head,
allowing bidders to place bids in the auction via L2 transactions
(but no longer via L1).

</td></tr><tr></tr><tr><td>

`FanoutStandingBid [P2]`. During the bidding period,
the standing bid can be moved back to L1
via fanout from the Hydra Head,
allowing bidders to place bids in the auction via L1 transactions
(but no longer via L2).
This transition is undesirable because
bidding on L1 is less convenient than on L2.

</td></tr><tr></tr><tr><td>

`[P3]`. During the purchase period,
bidders can no longer submit any new bids
(neither via L1 nor L2).

</td></tr><tr></tr><tr><td>

`FanoutStandingBid [P3]`. During the purchase period
(preferrably at the bidding end time `T2`),
the standing bid can be moved back to L1
via fanout from the Hydra Head,
after which bidders can no longer submit any new bids
(neither via L1 nor L2).

</td></tr><tr></tr><tr><td>

`BidderBuys [P3]`. During the purchase period,
the bidder can buy the auction lot,
paying the winning bid amount to the seller
and depositing the total auction fees in the fee escrow.

</td></tr><tr></tr><tr><td>

`[P4]`. During the penalty period,
the winning bidder can no longer buy the auction lot.

</td></tr><tr></tr><tr><td>

`SellerReclaims [P4 ∪ P5]`. During the penalty period
and during the cleanup period,
if the winning bidder (if any) did not buy the auction lot,
then the seller may reclaim the auction lot,
depositing the total auction fees in the fee escrow.

</td></tr><tr></tr><tr><td>

`Cleanup [P5]`. During the cleanup period,
the seller can spend the standing bid utxo,
recovering the min 2 ADA inside it.

</td></tr></table>

## User Needs Overview
Note: the assumption for v1 of this specification is that transactions which require delegate signatures, such as MoveToL2, will be handled separately by delegate infrastructure.

<table><tr><td>

<table>
    <thead>
        <tr>
            <th rowspan=2 colspan=2>User Needs</th>
            <th rowspan=2>All Users</th>
            <th rowspan=2>Seller</th>
            <th colspan=2>Bidder</th>
			<th rowspan=2>Delegate</th>
        </tr>
		<tr>
            <th>Winner</th>
            <th>Loser</th>
		</tr>
    </thead>
    <tbody>
        <tr>
            <th colspan=2>∅</td>
			<td>Browse Auctions</td>
            <td>Announce Auction</td>
            <td colspan=2></td>
            <td>Register as Delegate, Update Delegate Info</td>
        </tr>
		<tr>
            <th colspan=2>Announced</td>
			      <td rowspan=5> View Auction Details</td>
            <td>Authorize Bidders, Start Bidding, Cancel Auction?</td>
            <td>Place Deposit</td>
            <td></td>
            <td></td>
        </tr>
		<tr>
            <th rowspan=2>Ongoing</td>
            <th>Bidding on L1</td>
			      <td rowspan=2>Authorize Bidders</td>
            <td rowspan=2 colspan=2>Place Deposit, Bid</td>
            <td></td>
        </tr>
		<tr>
            <th>Bidding on L2</td>
            <td></td>
        </tr>
		<tr>
            <th rowspan=2>Resolution</td>
            <th>Voucher Active</td>
            <td></td>
            <td>Claim Lot</td>
            <td rowspan=3> Refund Deposit </td>
            <td></td>
        </tr>
		<tr>
            <th>Voucher Unclaimed</td>
            <td>Reclaim Lot</td>
            <td>Refund Deposit</td>
            <td></td>
        </tr>
		<tr>
            <th colspan=2>Concluded</td>
            <td>Cleanup Auction, View Auction Results?</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>

## General User Needs
### ∅ (All States)
 - Browse Auctions
### Announced, Ongoing, Resolution
- View Auction Details
### Concluded
- View Auction Results?
## Seller Needs

### ∅ (All States)
- Announce Auction
### Announced 
- Authorize Bidders
- Start Bidding
- Cancel Auction?
### Ongoing
- Authorize Bidders
### Resolution
#### Voucher Expired
- Reclaim Lot
### Concluded
- Cleanup Auction

## Bidder Needs

### ∅ (All States)
### Announced 
- Place Deposit
### Ongoing
- Place Deposit
- Bid
### Resolution
#### Voucher Active
- Claim Lot
- Reclaim Deposit (Losers Only)
#### Voucher Expired
- Reclaim Deposit
### Concluded
- Reclaim Deposit

## Delegate Needs
### ∅ (All States)
 - Register as Delegate
 - Update Delegate Registration

# Pages
## Browse
Display:
- Active Auctions

## Create Auction
Allow Seller:
  - Define Auction Terms (Probably want to abstract some of these)
    - Lot
    - Start, End & Purchase, and Cleanup Times
    - Starting Bid
    - Minimum Increment?
    - Minimum Deposit?
    - Delegates?
    - Delegate Fees?
  - Submit Auction Creation Tx

## Auction Details
This could be a single page or split into multiple. In some form these need to:

Display:
 - Auction Lot Details (Assume single NFT for now?)
 - Standing Bid

### Upcoming Auction Details
Display:
  - Auction Start Time | "Waiting for Seller..."
    - This is the *earliest* start time, seller determines actual start with the StartBidding tx. 

Allow Seller:
  - View & Authorize Bidders (should this be a new page?)
  - Start Bidding
  - Cancel Auction?

Allow Bidders:
  - Place Deposit

### Ongoing Auction Details
Display:
  - Time Left

Allow Seller:
  - View & Authorize Bidders (should this be a new page?)

Allow Bidder:
  - Place Deposit
  - Bid

### Ended/Resolving Auction

Display:
 - Reclaim Deadline

Allow Winner:
  - Claim Lot (Before Purchase Deadline)
  - Reclaim Deposit (After Purchase Deadline)

Allow Loser:
  - Reclaim Deposit

Allow Seller:
 - Reclaim Lot (After Purchase Deadline)

Allow Any?:
- Cleanup Auction (After Cleanup)

## Delegate Portal
On load we query for existing registrations that match the user's wallet & display if found.
This means we do not support multiple registrations with one wallet for v1.

Display: 
- Existing Registration

Allow:
 - New Registration
 - Update Registration
