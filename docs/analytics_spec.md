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

TODO: Create Board Embedding Tutorial

# Implementation
