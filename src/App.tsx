import AuctionList from './components/AuctionList/AuctionList';
import CreateAuction from './components/CreateAuction/CreateAuction';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <MeshProvider>
        <ReactQueryProvider>
          <WebSocketProvider>
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
          </WebSocketProvider>
        </ReactQueryProvider>
      </MeshProvider>
    </BrowserRouter>
  );
}

export default App;
