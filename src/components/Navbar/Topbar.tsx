import { Link } from 'react-router-dom';
import CustomWallet from '../CustomWallet/CustomWallet';
import { StringInput } from '../Inputs/StringInput';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const TAB_ROUTES = {
  ANALYTICS: {
    href: '/analytics',
    label: 'Analytics',
  },
  EXPLORE: {
    href: '/auction-list',
    label: 'Explore',
  },
  CREATE: {
    href: '/create-auction-list',
    label: 'Create',
  },
  DELEGATES: { //currently unused in the navbar, we don't have any restrictions on the portal and probably don't want just anyone using it
    href: '/delegate-portal',
    label: 'Delegate Portal',
  }
};
export default function Topbar() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="flex">
        <ul className="flex ml-10 items-center">
          <li className="mr-10 hidden md:block text-3xl">
            <a href="/">
              {/* <img src="/images/mlabs.png" alt="MLabs" className="w-20 h-20" /> */}
              Hydra Auction
            </a>
          </li>
          <li className=" items-center relative hidden md:flex">
            <MagnifyingGlassIcon className="text-black w-4 h-4 absolute left-0" />
            <StringInput label="" inputId="search" className="pl-6" />
          </li>
        </ul>
        <ul className="flex p-2 items-center ml-auto">
          <li className="pr-3">
            <Link
              className="hover:text-black text-slate-700"
              to={TAB_ROUTES.EXPLORE.href}
            >
              {TAB_ROUTES.EXPLORE.label}
            </Link>
          </li>
          <li className="ml-3 pr-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to={TAB_ROUTES.CREATE.href}
            >
              {TAB_ROUTES.CREATE.label}
            </Link>
          </li>
          <li className="ml-3 pr-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to={TAB_ROUTES.ANALYTICS.href}
            >
              {TAB_ROUTES.ANALYTICS.label}
            </Link>
          </li>

          <li className="ml-3 pr-3">
            <CustomWallet isDark={false} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
