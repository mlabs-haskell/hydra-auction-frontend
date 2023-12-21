import { useState, useEffect } from 'react';
import { AuctionInfo } from 'public/dist/types';
import AuctionList from './Components/AuctionList/AuctionList';
import CreateAuction from './Components/CreateAuction/CreateAuction';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnterAuctionPage } from './Components/EnterAuction/EnterAuction';
import PlaceBid from './Components/PlaceBid/PlaceBid';
import AuctionDetail from './Components/AuctionDetail/AuctionDetail';
import ReactQueryProvider from './providers/ReactQueryProvider';
import Layout from './Components/layout';
import TopBar from './Components/Navbar/TopBar';
import { MeshProvider } from '@meshsdk/react';
import CreateAuctionList from './Components/CreateAuction/CreateAuctionList';
import Footer from './Components/Footer/Footer';

function App() {
  const [queryAuctions, setQueryAuctions] = useState<
    (() => Promise<AuctionInfo[] | undefined>) | undefined
  >(undefined);

  // TODO: remove and replace with actual api functions
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
      <MeshProvider>
        <ReactQueryProvider>
          <>
            {/* Navbar */}
            <TopBar />

            {/* Route configuration */}
            <Layout>
              <Routes>
                <Route path="/" element={<AuctionList />} />
                <Route path="/auction-list" element={<AuctionList />} />
                <Route path="/create-auction" element={<CreateAuction />} />
                <Route path="/enter-auction" element={<EnterAuctionPage />} />
                <Route path="/place-bid" element={<PlaceBid />} />
                <Route path="/auction" element={<AuctionDetail />} />
                <Route
                  path="/create-auction-list"
                  element={<CreateAuctionList />}
                />
                {/* TODO: collection/wallet routes */}
              </Routes>
            </Layout>
            <Footer />
          </>
        </ReactQueryProvider>
      </MeshProvider>
    </BrowserRouter>
  );
}

export default App;
