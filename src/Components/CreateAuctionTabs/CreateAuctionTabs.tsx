import { Asset } from '@meshsdk/core';
import { useState } from 'react';
import CustomButton from '../CustomButton/CustomButton';
import NavPiece from './NavPiece';
import SelectTab from './SelectTab';
import CreateAuctionForm from '../CreateAuction/CreateAuctionForm';

type CreateAuctionTabsProps = {
  assetToList: Asset | undefined;
};

const ANNOUNCE_AUCTION_TABS = [
  {
    label: 'Select NFT',
    accessor: 'select',
  },
  {
    label: 'Auction Details',
    accessor: 'details',
  },
];

type CreateAuctionNavProps = {
  activeTab: number;
  setActiveTab: (tab: number) => void;
};
const CreateAuctionNav = ({
  activeTab,
  setActiveTab,
}: CreateAuctionNavProps) => {
  return (
    <div className="flex text-body font-semibold mb-6">
      {ANNOUNCE_AUCTION_TABS.map((tab, index) => {
        return (
          <NavPiece
            key={index}
            label={tab.label}
            accessor={tab.accessor}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isActive={
              ANNOUNCE_AUCTION_TABS[activeTab].accessor === tab.accessor
            }
            onClick={() =>
              setActiveTab(
                ANNOUNCE_AUCTION_TABS.findIndex(
                  (auctionTab) => auctionTab.accessor === tab.accessor
                )
              )
            }
            isLastIndex={index === ANNOUNCE_AUCTION_TABS.length - 1}
          />
        );
      })}
    </div>
  );
};

const TabSwitch = ({ tab }: { tab: string }) => {
  if (tab === 'select') {
    return <SelectTab />;
  }
  return <CreateAuctionForm />;
};

export default function AnnounceTabs({ assetToList }: CreateAuctionTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleNext = () => {
    activeTab < ANNOUNCE_AUCTION_TABS.length - 1 && setActiveTab(activeTab + 1);
  };
  return (
    <div className="flex flex-col h-full">
      <CreateAuctionNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabSwitch tab={ANNOUNCE_AUCTION_TABS[activeTab].accessor} />

      <div className="flex mt-6">
        {activeTab < ANNOUNCE_AUCTION_TABS.length - 1 && (
          <CustomButton onClick={handleNext} label="Next" className="w-full" />
        )}
        <CustomButton label="Save" className="w-full bg-white text-black" />
      </div>
    </div>
  );
}
