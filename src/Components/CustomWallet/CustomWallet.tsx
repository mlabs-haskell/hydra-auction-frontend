import { CardanoWallet, useWallet, WalletContext } from '@meshsdk/react';
import { useWalletStore } from '@meshsdk/react/dist/contexts/WalletContext';
import { useEffect } from 'react';

type CustomWalletProps = {
  isDark: boolean;
};

export default function CustomWallet(
  { isDark }: CustomWalletProps = { isDark: false }
) {
  const { connect, disconnect, connecting, connected, wallet } = useWallet();
  // TODO: this needs a shim or some way to import the store
  // need to use the wallet store, not useWallet because we need the name of the wallet and useWallet doesnt provide that
  // const {
  //   connectWallet,
  //   connectedWalletName,
  //   connectingWallet,
  //   hasConnectedWallet,
  // } = useWalletStore();

  useEffect(() => {
    const lastConnectedWallet = localStorage.getItem('lastConnectedWallet');
    if (lastConnectedWallet && !connected) {
      try {
        connect(JSON.parse(lastConnectedWallet).name);
      } catch (err) {
        console.log(err);
      }
      //   connect(JSON.parse(lastConnectedWallet).name);
    }
  }, []);

  const storeConnection = () => {
    localStorage.setItem(
      'lastConnectedWallet',
      JSON.stringify({
        // name: connectedWalletName,
        name: 'Nami',
        timestamp: Date.now(),
      })
    );
  };

  return (
    <div>
      <CardanoWallet isDark={isDark} onConnected={storeConnection} />
    </div>
  );
}
