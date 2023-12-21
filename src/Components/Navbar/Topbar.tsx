import { Link } from 'react-router-dom';
import CustomWallet from '../CustomWallet/CustomWallet';
import { StringInput } from '../Inputs/StringInput';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function TopBar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="flex">
        <ul className="flex ml-10 items-center">
          <li className="mr-10">
            <a href="/">
              <img src="/images/mlabs.png" alt="MLabs" className="w-20 h-20" />
            </a>
          </li>
          <li className="flex items-center relative">
            <MagnifyingGlassIcon className="text-black w-4 h-4 absolute left-0" />
            <StringInput label="" inputId="search" className="pl-6" />
          </li>
        </ul>
        <ul className="flex p-2 items-center ml-auto">
          <li className="pr-3">
            <Link
              className="hover:text-black text-slate-700"
              to="/auction-list"
            >
              Explore
            </Link>
          </li>
          <li className="ml-3 pr-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/create-auction-list"
            >
              Create
            </Link>
          </li>
          {/* <li className="ml-3 pr-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/create-auction"
            >
              Announce Auction Form
            </Link>
          </li> */}
          {/* <li className="ml-3 pr-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/enter-auction"
            >
              Enter Auction Form
            </Link>
          </li>
          <li className="ml-3 pr-3 ">
            <Link className="hover:text-black text-slate-700" to="/place-bid">
              Place Bid Form
            </Link>
          </li> */}

          <li className="ml-3 pr-3">
            {/* <CardanoWallet isDark={false} /> */}
            <CustomWallet isDark={false} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
