import React, { useState, useEffect } from 'react';
import { AuctionInfo } from 'public/dist/types';
import AuctionList from './pages/AuctionList';
import './App.css';

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
    <div className="App">
      <AuctionList key={queryAuctions ? 'updated' : 'initial'} />
    </div>
  );
}

export default App;
