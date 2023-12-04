import React, { useState, useEffect } from 'react';
import { AuctionInfo } from 'public/dist/types';
import AuctionList from './pages/AuctionList';
import AnnounceAuction from './Components/AnnounceAuction';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

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
        <header>
          <nav>
            <ul>
              <li>
                <Link
                  className="hover:underline text-blue-400"
                  to="/auction-list"
                >
                  Auction List
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline text-blue-400"
                  to="/announce-auction"
                >
                  Announce Auction
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Route configuration */}
        <Routes>
          <Route path="/auction-list" element={<AuctionList />} />
          <Route path="/announce-auction" element={<AnnounceAuction />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
