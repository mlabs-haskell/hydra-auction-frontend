import clsx from 'clsx';
import React from 'react';

type NavPieceProps = {
  label: string;
  accessor: string;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  isActive: boolean;
  onClick: () => void;
  isLastIndex: boolean;
};
const NavPiece = ({
  label,
  accessor,
  activeTab,
  setActiveTab,
  isActive,
  onClick,
  isLastIndex = false,
}: NavPieceProps) => {
  return (
    <button onClick={onClick} className="flex">
      <div
        className={clsx(
          'mr-3 md:mr-6',
          isActive ? 'opacity-100' : 'opacity-60'
        )}
      >
        <div className="">{label}</div>
      </div>
      <div
        className={clsx(
          'mr-3 md:mr-6',
          isActive ? 'opacity-100' : 'opacity-60',
          isLastIndex ? 'hidden' : 'block'
        )}
      >
        {'>'}
      </div>
    </button>
  );
};
export default NavPiece;
