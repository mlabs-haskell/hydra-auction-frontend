import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import React from 'react';

type NavPieceProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  isLastIndex: boolean;
};
const NavPiece = ({
  label,
  isActive,
  onClick,
  isLastIndex = false,
}: NavPieceProps) => {
  return (
    <button onClick={onClick} className="flex items-center">
      <div
        className={clsx(
          'mr-3 md:mr-6',
          isActive ? 'opacity-100' : 'opacity-60'
        )}
      >
        {label}
      </div>
      <div
        className={clsx(
          'mr-3 md:mr-6',
          isActive ? 'opacity-100' : 'opacity-60',
          isLastIndex ? 'hidden' : 'block'
        )}
      >
        <ChevronRightIcon className="text-black w-4 h-4" />
      </div>
    </button>
  );
};
export default NavPiece;
