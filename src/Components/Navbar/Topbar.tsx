import { Link } from 'react-router-dom';
import { CardanoWallet } from '@meshsdk/react';
import CustomWallet from '../CustomWallet/CustomWallet';

export default function TopBar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="">
        <ul className="flex p-2">
          <li className="pe-3">
            <Link
              className="hover:text-black text-slate-700"
              to="/auction-list"
            >
              Query Auctions
            </Link>
          </li>
          <li className="ms-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/announce-auction-list"
            >
              Announce Auction List
            </Link>
          </li>
          <li className="ms-3 pe-3 ">
            <Link
              className="hover:text-black text-slate-700"
              to="/announce-auction"
            >
              Announce Auction Form
            </Link>
          </li>
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
