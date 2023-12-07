import React, { useState, useEffect } from 'react';
import { AuctionInfo } from 'public/dist/types';
import AuctionList from './Components/AuctionList/AuctionList';
import AnnounceAuction from './Components/AnnounceAuction/AnnounceAuction';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EnterAuction from './Components/EnterAuction/EnterAuction';
import PlaceBid from './Components/PlaceBid';
import AuctionDetail from './Components/AuctionDetail/AuctionDetail';

function App() {
  const [queryAuctions, setQueryAuctions] = useState<
    (() => Promise<AuctionInfo[] | undefined>) | undefined
  >(undefined);

  interface CustomWindow extends Window {
    queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
  }

  // Effect to check for changes in CustomWindow.queryAuctions
  useEffect(() => {
    const customWindow = window as CustomWindow;

    const interval = setInterval(() => {
      if (
        customWindow.queryAuctions &&
        typeof customWindow.queryAuctions === 'function' &&
        !queryAuctions
      ) {
        setQueryAuctions(customWindow.queryAuctions);
        console.log('queryAuctions set');
        clearInterval(interval);
      }
    }, 1000); // Loop every 1000 milliseconds (1 second) until queryAuctions is set

    return () => clearInterval(interval);
  }, [queryAuctions]);

  return (
    <BrowserRouter>
      <div>
        {/* Header with links */}
        <header className="bg-white border-b-2 border-gray-300">
          <nav className="">
            <ul className="flex p-2 ">
              <li className="pe-3 border-r-2 border-gray-200">
                <Link
                  className="hover:text-black text-slate-700"
                  to="/auction-list"
                >
                  Auction List
                </Link>
              </li>
              <li className="ms-3 pe-3 border-r-2 border-gray-200">
                <Link
                  className="hover:text-black text-slate-700"
                  to="/announce-auction"
                >
                  Announce Auction
                </Link>
              </li>
              <li className="ms-3 pe-3 border-r-2 border-gray-200">
                <Link
                  className="hover:text-black text-slate-700"
                  to="/enter-auction"
                >
                  Enter Auction
                </Link>
              </li>
              <li className="ms-3 pe-3 border-r-2 border-gray-200">
                <Link
                  className="hover:text-black text-slate-700"
                  to="/place-bid"
                >
                  Place Bid
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Route configuration */}
        <Routes>
          <Route path="/auction-list" element={<AuctionList />} />
          <Route path="/announce-auction" element={<AnnounceAuction />} />
          <Route path="/enter-auction" element={<EnterAuction />} />
          <Route path="/place-bid" element={<PlaceBid />} />
          <Route path="/auction" element={<AuctionDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
