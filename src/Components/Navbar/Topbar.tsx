import { Link } from 'react-router-dom';
import { CardanoWallet } from '@meshsdk/react';
import CustomWallet from '../CustomWallet/CustomWallet';
import { StringInput } from '../Inputs/StringInput';

//TODO: add icons for search bar, and add logo
export default function TopBar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="flex">
        <ul className="flex ms-10 items-center">
          <li className="me-10">LOGO</li>
          <li>
            <StringInput label="" inputId="search" />
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
          <li className="ms-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/announce-auction-list"
            >
              Announce
            </Link>
          </li>
          {/* <li className="ms-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/announce-auction"
            >
              Announce Auction Form
            </Link>
          </li> */}
          {/* <li className="ms-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/enter-auction"
            >
              Enter Auction Form
            </Link>
          </li>
          <li className="ms-3 pe-3 ">
            <Link className="hover:text-black text-slate-700" to="/place-bid">
              Place Bid Form
            </Link>
          </li> */}

          <li className="ms-3 pe-3 ml-auto">
            {/* <CardanoWallet isDark={false} /> */}
            <CustomWallet isDark={false} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
