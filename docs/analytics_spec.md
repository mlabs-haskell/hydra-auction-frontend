# Table of Contents
1. [Requirements](#requirements)
    1. [Page Views](#page-views)
    2. [Actions](#actions)
2. [Design](#design)
    1. [Setup](#setup)
        1. [Setting Up a Mixpanel Account](#setting-up-a-mixpanel-account)
        2. [Linking Mixpanel to Hydra-Auction](#linking-mixpanel-to-hydra-auction)
    2. [For Product Owners](#for-product-owners)
        1. [Tutorial: Boards and Reports](#tutorial-boards-and-reports)
    3. [For End Users](#for-end-users)
        1. [Default Board: Marketplace Board](#default-board-marketplace-board)
        2. [Integrating a Custom Board](#integrating-a-custom-board)
3. [Implementation](#implementation)
    1. [Types](#types)
    2. [Events](#events)
        1. [Auction Viewed](#auction-viewed)
        2. [Auction Analytics Viewed](#auction-analytics-viewed)
        3. [Auctions Announced](#auctions-announced)
        4. [Deposit Placed on Auction](#deposit-placed-on-auction)
        5. [Bidder Authorized](#bidder-authorized)
        6. [Bid Placed](#bid-placed)
        7. [Lot Claimed](#lot-claimed)
        8. [Deposit Refunded](#deposit-refunded)

# Requirements

Hydra Auction is designed in part to be a framework for development of Hydra-based products. The analytics system outlined in this document is designed specifically to be extensible in a discrete manner, such that the developers of these future products have control over the analytics gathered and those provided to users.

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

When adapting the Hydra-Auction SDK for use, if they want to make use of our analytics design, the product owners are expected to create a Mixpanel project. Free accounts handle up to 20 million events per month.

### Setting up a Mixpanel Account
In order to receive events and use them in a custom board, you need to create a Mixpanel account.
Visit https://mixpanel.com/ and click the ‘Get Started Free’ button in the top right.


You will be prompted to enter an email or continue with google. We recommend using google as it simplifies the login process.

Once you are logged in, you will need to create a new project. This can be done via the dropdown in the top right corner - exposing the ‘Create Project’ button.

Feel free to name the project whatever you wish.
Once you have a new project, you can access your project token which is needed to link events through Hydra to your Mixpanel. This can be found in project settings via the cog dropdown in the top right. Your token should be listed under ‘Access Keys’.

### Linking Mixpanel to Hydra-Auction
To link Hydra-Auction events to your new Mixpanel project, copy the project token and paste it into the `REACT_APP_MIXPANEL_TOKEN` environment variable located in your .env file.

All events sent from Hydra-Auction will now show up in your Mixpanel projects. You can view these by going to the Mixpanel ‘Events’ in the top left navbar.

## For Product Owners

As a product owner you can view all events privately through your dashboard. The events outlined here will automatically begin to appear, and you may choose to include more events if you wish.

### Tutorial: Boards and Reports
Boards and reports are generated based on events that are sent to Mixpanel. These events have properties attached to them such as wallet address, auction lot, bid amount, etc…

Properties are used to present the data in a meaningful way via filtering and sorting. For example you can see all bids placed on a certain auction id, sorted by the bid amount. To see which properties each event has, click on an event in the events list and select ‘Your Properties’. This displays which properties you can use to analyze your events.

Try making a simple report with the ‘AuctionViewed’ event. This would be under the ‘Reports’ drop-down menu as ‘Insight’. From this page you pick the metric, which in our case is the ‘AuctionViewed’ event. Try adding ‘auctionId’ to the ‘Breakdown’. You should now see both a chart and table of the auctions viewed grouped by the ‘auctionId’.

Grouping can be useful for tracking properties that are unique to your auctions. You might want to see which of your auctions got viewed the most, or which bidder placed the most bids on your auctions. You can accomplish this by using the ‘walletAddr’ or ‘auctionId’ properties to filter out auctions that aren’t yours.

Make sure you have gone through a few auction flows with your Mixpanel project linked in the .env in order to generate events to work with.

## For End Users

To present these analytics to the users, you can create your own custom boards and have them embedded in the site.

### Default Board: Marketplace Board
This board shows metrics that relate to the entire marketplace, such as:

- announced auctions sorted by delegate group
- announced auctions sorted by submitting wallet
- announced auctions sorted by lot
- started auctions sorted by lot
- bids placed sorted by submitting wallet

### Integrating a Custom Board
To replace the default board with your own custom Mixpanel board, only the .env needs to be changed.

Copy the board link and paste it into the `REACT_APP_MIXPANEL_BOARD_LINK`. The board under the Analytics tab should show your board after this change and restarting the server.

Note: This embedding will only work with a public Mixpanel board.

Once your project has been created, you'll be able to use your project token to connection your adapted Hydra-Auction to your Mixpanel project, and should see our premade events begin to appear in your Mixpanel dashboard.

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
