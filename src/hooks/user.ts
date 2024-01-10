import {
  QueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AuctionInfo } from 'hydra-auction-offchain';

enum UserType {
  SELLER = 'SELLER',
  BIDDER = 'BIDDER',
}

type Seller = {
  sellerVk: string;
  sellerPkh: string;
  auctions?: AuctionInfo[];
};

type Bidder = {
  bidderVk: string;
  auctions?: AuctionInfo[];
};
type User = {
  type: UserType;
  seller?: Seller;
  bidder: Bidder;
};

const MOCK_USER: User = {
  type: UserType.BIDDER,
  bidder: {
    bidderVk:
      '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9',
  },
};

const USER_QUERY_KEY = 'user';

export const useUser = () => {
  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      return MOCK_USER;
    },
  });
  return { data, isError, isLoading, isFetching };
};

// For now a way to identify if the user is a bidder on the auction
export const useAddBidderAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async (newAuction: AuctionInfo) => {
      await queryClient.cancelQueries(USER_QUERY_KEY as QueryFilters);

      const previousUser = queryClient.getQueryData<User>([USER_QUERY_KEY]);

      if (!previousUser) {
        const newUser: User = MOCK_USER;

        queryClient.setQueryData<User>([USER_QUERY_KEY], newUser);

        return newUser;
      }
      // Create a new user with the auction if there's no previous user data
      if (!previousUser.bidder?.auctions) {
        const newBidderUser: User = {
          ...previousUser,
          bidder: {
            ...previousUser.bidder,
            auctions: [newAuction],
          },
        };

        queryClient.setQueryData<User>([USER_QUERY_KEY], newBidderUser);

        return newBidderUser;
      }

      // If there's previous user data and it has a bidder property with auctions
      if (previousUser.bidder && previousUser.bidder.auctions) {
        const updatedUser: User = {
          ...previousUser,
          bidder: {
            ...previousUser.bidder,
            auctions: [...previousUser.bidder.auctions, newAuction],
          },
        };

        queryClient.setQueryData<User>([USER_QUERY_KEY], updatedUser);

        return updatedUser;
      }
    },
  });
};
