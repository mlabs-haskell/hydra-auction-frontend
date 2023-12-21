import { Link } from 'react-router-dom';
import CustomWallet from '../CustomWallet/CustomWallet';
import { StringInput } from '../Inputs/StringInput';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

//TODO: add icons for search bar, and add logo
export default function TopBar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="flex">
        <ul className="flex ml-10 items-center">
          <li className="mr-10">
            <a href="http://mlabs.com/" target="_blank" rel="noreferrer">
              <img src="/images/mlabs.png" alt="MLabs" className="w-20 h-20" />
            </a>
          </li>
          <li className="flex items-center relative">
            <MagnifyingGlassIcon className="text-black w-4 h-4 absolute left-0" />
            <StringInput label="" inputId="search" className="pl-6" />
          </li>
        </ul>
        <ul className="flex p-2 items-center ml-auto">
          <li className="pe-3">
            <Link
              className="hover:text-black text-slate-700"
              to="/auction-list"
            >
              Browse
            </Link>
          </li>
          <li className="ml-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/announce-auction-list"
            >
              Announce
            </Link>
          </li>
          {/* <li className="ml-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/announce-auction"
            >
              Announce Auction Form
            </Link>
          </li> */}
          {/* <li className="ml-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/enter-auction"
            >
              Enter Auction Form
            </Link>
          </li>
          <li className="ml-3 pe-3 ">
            <Link className="hover:text-black text-slate-700" to="/place-bid">
              Place Bid Form
            </Link>
          </li> */}

          <li className="ml-3 pe-3">
            {/* <CardanoWallet isDark={false} /> */}
            <CustomWallet isDark={false} />
          </li>
        </ul>
      </nav>
    </header>
  );
}