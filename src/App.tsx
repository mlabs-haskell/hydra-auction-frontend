import AuctionList from './components/AuctionList/AuctionList';
import CreateAuction from './components/CreateAuction/CreateAuction';
import './App.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import AuctionDetail from './components/AuctionDetail/AuctionDetail';
import ReactQueryProvider from './providers/ReactQueryProvider';
import Layout from './components/layout';

import { MeshProvider } from '@meshsdk/react';
import CreateAuctionList from './components/CreateAuction/CreateAuctionList';
import Footer from './components/Footer/Footer';
import Topbar from './components/Navbar/Topbar';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WebSocketProvider } from './providers/WebSocketProvider';
import MixPanelProvider from './providers/MixPanelProvider';
import Analytics from './components/Analytics/Analytics';
import DelegatePortal from './components/DelegatePortal/DelegatePortal';
require('dotenv').config();
function App() {
  return (
    <HashRouter>
      <MeshProvider>
        <ReactQueryProvider>
          <WebSocketProvider>
            <MixPanelProvider>
              <>
                {/* Navbar */}
                <Topbar />

                {/* Route configuration */}
                <Layout>
                  <Routes>
                    <Route path="/" element={<AuctionList />} />
                    <Route path="/auction-list" element={<AuctionList />} />
                    <Route path="/create-auction" element={<CreateAuction />} />
                    <Route path="/auction" element={<AuctionDetail />} />
                    <Route
                      path="/create-auction-list"
                      element={<CreateAuctionList />}
                    />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/delegate-portal" element={<DelegatePortal/>} />
                    {/* TODO: collection/wallet routes */}
                  </Routes>
                </Layout>
                <ToastContainer
                  position="bottom-center"
                  autoClose={5000}
                  hideProgressBar={true}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  transition={Bounce}
                />

                <Footer />
              </>
            </MixPanelProvider>
          </WebSocketProvider>
        </ReactQueryProvider>
      </MeshProvider>
    </HashRouter>
  );
}

export default App;
