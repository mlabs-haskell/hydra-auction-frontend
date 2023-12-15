import { Asset } from '@meshsdk/core';
import { useState } from 'react';
import CustomButton from '../CustomButton/CustomButton';

type AnnouneAuctionTabsProps = {
  assetToList: Asset | undefined;
};

// enum AnnounceAuctionTabs {
//   SELECT = 'select',
//   ANNOUNCE = 'announce',
// }

const announceAuctionTabs = [
  {
    label: 'Select NFT',
    accessor: 'select',
  },
  {
    label: 'Auction Details',
    accessor: 'details',
  },
];

const NavPiece = ({
  label,
  accessor,
  activeTab,
  setActiveTab,
}: {
  label: string;
  accessor: string;
  activeTab: number;
  setActiveTab: (tab: number) => void;
}) => {
  const isActive = announceAuctionTabs[activeTab].accessor === accessor;
  const className = `me-3 md:me-6 ${isActive ? 'opacity-100' : 'opacity-60'}`;
  return (
    <button
      onClick={() =>
        setActiveTab(
          announceAuctionTabs.findIndex((x) => x.accessor === accessor)
        )
      }
      className="flex"
    >
      <div className={className}>
        <div className="">{label}</div>
      </div>
      <div className={className}>{'>'}</div>
    </button>
  );
};

type AnnounceNavProps = {
  activeTab: number;
  setActiveTab: (tab: number) => void;
};
const AnnounceNav = ({ activeTab, setActiveTab }: AnnounceNavProps) => {
  return (
    <div className="flex text-body font-semibold mb-6">
      {announceAuctionTabs.map((tab, index) => {
        return (
          <NavPiece
            key={index}
            label={tab.label}
            accessor={tab.accessor}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      })}
    </div>
  );
};

const SelectNft = () => {
  return (
    <>
      <div className="flex mb-6">
        <div className="font-semibold">List most recently minted</div>
      </div>
      <div className="text-dim mb-6">Or choose</div>

      <div className="mb-8">
        <div className="font-semibold">NFT</div>
      </div>
      <div className="text-dim border-b-2 w-60 border-black p-2 mb-6">
        Select an nft
      </div>
    </>
  );
};

const TabSwitch = ({ tab }: { tab: string }) => {
  if (tab === 'select') {
    return <SelectNft />;
  }
  return <></>;
};

export default function AnnounceTabs({ assetToList }: AnnouneAuctionTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleNext = () => {
    activeTab < announceAuctionTabs.length - 1 && setActiveTab(activeTab + 1);
  };
  return (
    <div className="flex flex-col h-full">
      <AnnounceNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabSwitch tab={announceAuctionTabs[activeTab].accessor} />

      <div className="grid grid-cols-2 mt-auto">
        <CustomButton onClick={handleNext} label="Next" className="w-full" />
        <CustomButton label="Save" className="w-full bg-white text-black" />
      </div>
    </div>
  );
}
