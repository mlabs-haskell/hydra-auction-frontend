import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import { Cross1Icon } from '@radix-ui/react-icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../shadcn/DropdownMenu';
import { useState } from 'react';
import { OutsideAlerter } from '../OutsideAlerter/OutsideAlerter';

export const DropdownCheckbox = ({
  children,
  label,
  subLabel,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  subLabel: string;
  disabled?: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`flex flex-col justify-center items-center w-full ${
        disabled && 'opacity-50'
      }`}
    >
      <DropdownMenu open={menuOpen}>
        <DropdownMenuTrigger
          disabled={disabled}
          className={`bg-gray-100 border-b-2 border-black px-4 py-2  ${
            disabled && 'opactiy-50'
          }`}
          asChild
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <button className="text-dim w-full">
            <div className="flex items-center gap-3 justify-between ">
              <div>{label}</div>
              {menuOpen ? (
                <ChevronUpIcon className="fill-current text-black" />
              ) : (
                <ChevronDownIcon className="fill-current text-black" />
              )}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuLabel>
            <div className="flex justify-between">
              <div>{subLabel}</div>
              <button
                className="font-bold text-red-500"
                onClick={() => setMenuOpen(false)}
              >
                <Cross1Icon />
              </button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <OutsideAlerter onOutsideClick={() => setMenuOpen(false)}>
            {children}
          </OutsideAlerter>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
