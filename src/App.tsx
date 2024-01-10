import AuctionList from './Components/AuctionList/AuctionList';
import CreateAuction from './Components/CreateAuction/CreateAuction';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnterAuctionPage } from './Components/EnterAuction/EnterAuction';
import PlaceBid from './Components/PlaceBid/PlaceBid';
import AuctionDetail from './Components/AuctionDetail/AuctionDetail';
import ReactQueryProvider from './providers/ReactQueryProvider';
import Layout from './Components/layout';

import { MeshProvider } from '@meshsdk/react';
import CreateAuctionList from './Components/CreateAuction/CreateAuctionList';
import Footer from './Components/Footer/Footer';
import Topbar from './Components/Navbar/Topbar';

function App() {
  return (
    <BrowserRouter>
      <MeshProvider>
        <ReactQueryProvider>
          <>
            {/* Navbar */}
            <Topbar />

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
