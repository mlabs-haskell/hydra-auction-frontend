import { Asset } from '@meshsdk/core';
import { useState } from 'react';
import NavPiece from './NavPiece';
import SelectTab from './SelectTab';
import CreateAuctionForm from '../CreateAuction/CreateAuctionForm';
import Button from '../Button/Button';

type CreateAuctionTabsProps = {
  assetToList: Asset | undefined;
};

const ANNOUNCE_AUCTION_TABS = [
  {
    label: 'Select NFT',
    key: 'select',
  },
  {
    label: 'Auction Details',
    key: 'details',
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
            isActive={ANNOUNCE_AUCTION_TABS[activeTab].key === tab.key}
            onClick={() =>
              setActiveTab(
                ANNOUNCE_AUCTION_TABS.findIndex(
                  (auctionTab) => auctionTab.key === tab.key
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
      <TabSwitch tab={ANNOUNCE_AUCTION_TABS[activeTab].key} />

      <div className="flex mt-12">
        {activeTab !== ANNOUNCE_AUCTION_TABS.length - 1 && (
          <Button onClick={handleNext} label="Next" className="!px-32" />
        )}
        {/* <Button label="Save" className="w-full bg-white text-black" /> */}
      </div>
    </div>
  );
}
