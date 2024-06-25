# Requirements

Hydra Auction is designed in part to be a framework for development of hydra-based products. The analytics system outlined in this document is designed specifically to be extensible in a discrete manner, such that the developers of these future products have control over the analytics gathered and those provided to users.

For the purposes of demonstration, we selected the following set of useful metrics to display to product owners & end users:

## Page Views
- Auction Viewed
- Auction Analytics Viewed

## Actions
- Auctions Announced
- Deposit Placed on Auction
- Bidder Authorized
- Auction Started
- Bid Placed
- Lot Claimed
- Deposit Refunded

# Design

We've selected [Mixpanel](https://mixpanel.com) as a third party tool to help facilitate the gathering and presentation of analytics. We believe this system presents the best experience for both product owners & end users.

## Setup

When adapting the hydra-auction SDK for use, if they want to make use of our analytics design, the product owners are expected to create a Mixpanel project. Free accounts handle up to 20 million events per month.

[Get Started](https://mixpanel.com/pricing/)

Once your project has been created, you'll be able to use your project token to connection your adapted hydra-auction to your mixpanel project, and should see our premade events begin to appear in your Mixpanel dashboard.

## For Product Owners

As a product owner you can view all events privately through your dashboard. The events outlined here will automatically begin to appear, and you may choose to include more events if you wish.

## For End Users

To present these analytics to the users, you can create your own custom boards and have them embedded in the auction page.

https://docs.mixpanel.com/docs/features/embeds

### Marketplace Board
This board shows metrics that relate to the entire marketplace, such as:

- announced auctions sorted by delegate group
- announced auctions sorted by submitting wallet
- announced auctions sorted by lot
- started auctions sorted by lot
- bids placed sorted by submitting wallet

### Seller Board
This board would show metrics relevant to the seller, to be displayed when a user views an auction that they listed:

- auction views filtered by auctionId
- deposits placed filtered by auctionId
- bids placed filtered by auctionId
- refunds filtered by auctionId

### Bidder Board
This board would show metrics relevant to prospective bidders, to be displayed when a user views an auction that they haven't listed:

- announced auctions filtered by lot
- deposits placed filtered by auctionId
- bids placed filtered by auctionId

__TODO__: Create Board Embedding Tutorial

# Implementation

## Types
There are a few common types that appear across multiple analytics events. We make use of [Zod](https://zod.dev/) to ensure the robustness of these types. Here are their definitions:

```typescript
// z = zod
export const unitSchema = z.string().regex(/^[a-f0-9]{56,184}$/i);
export type unit = z.infer<typeof cardanoUnitSchema>;

export type userType = "Bidder" | "Seller";
```

All events extend the following `Event` type:
```typescript
{
  type: string,
  auctionId: currencySymbol,
  walletAddr: Address | undefined
}
```

## Events

### Auction Viewed
Triggers when the "View Auction" page is opened. Intended for use by the seller.

__Event Properties__
```typescript
{
  type: "AuctionViewed",
  auctionId: currencySymbol,
  walletAddr: Address | undefined,
  userType: userType,
}
```

### Auction Analytics Viewed
Triggers when the "Auction Analytics" view is opened. Intended for use by the implementer.

__Event Properties__
```typescript
{
  type: "AuctionAnalyticsViewed",
  auctionId: currencySymbol,
  walletAddr: Address | undefined,
  userType: userType,
}
```

### Auctions Announced
Triggers when the `announceAuction` transaction succeeds. Intended for general use.

__Event Properties__
```typescript
{
  type: "AuctionAnnounceSucceeded",
  auctionId: currencySymbol,
  walletAddr: Address,
  delegateGroupUrl: string,
  minDeposit: number,
  startingBid: number,
  lot: unit
}
```

### Deposit Placed on Auction
Triggers when the `enterAuction` transaction succeeds. Intended for use by seller.

__Event Properties__
```typescript
{
  type: "EnterAuctionSucceeded",
  auctionId: currencySymbol,
  walletAddr: Address
}
```

### Bidder Authorized
Triggers when the `authorizeBidders` transaction succeeds. Intended for use by seller, bidder.

__Event Properties__
```typescript
{
  type: "AuthorizeBiddersSucceeded",
  auctionId: currencySymbol,
  walletAddr: Address,
  bidders: string[] //bidder verification keys
}
```

### Auction Started
Triggers when the `startBidding` transaction succeeds. Intended for general use.

__Event Properties__
```typescript
{
  type: "StartBiddingSucceeded",
  auctionId: currencySymbol,
  walletAddr: Address
}
```

### Bid Placed
Triggers when the `placeBid` or `placeBidL2` transactions succeed. Intended for use by seller, bidder.

__Event Properties__
```typescript
{
  type: "PlaceBidSucceeded",
  auctionId: currencySymbol,
  walletAddr: Address,
  layer: number, // 1 | 2
  amount: number
}
```

### Lot Claimed
Triggers when the `claimAuctionLotBidder` or `claimAuctionLotSeller` transactions succeed. Intended for use by seller, implementer.

__Event Properties__
```typescript
{
  type: "ClaimLotSucceeded",
  auctionId: currencySymbol,
  walletAddr: Address,
  user: userType,
}
```

### Deposit Refunded
Triggers when the `claimDepositLoser` transaction succeeds. Intended for use by seller.

__Event Properties__
```typescript
{
  type: "DepositRefundSucceeded",
  auctionId: currencySymbol,
  walletAddr: Address
}
```
