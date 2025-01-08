import { CardanoWallet, useWallet } from '@meshsdk/react';
import { useEffect } from 'react';
import { setLocalStorageItem } from 'src/utils/localStorage';

type CustomWalletProps = {
  isDark: boolean;
};

export default function CustomWallet(
  { isDark }: CustomWalletProps = { isDark: false }
) {
  const { connect, name: walletName, connected } = useWallet();

  useEffect(() => {
    const lastConnectedWallet = localStorage.getItem('lastConnectedWallet');

    async function connectWallet() {
      if (lastConnectedWallet && !connected) {
        try {
          await connect(JSON.parse(lastConnectedWallet).name);
        } catch (err) {
          console.log(err);
        }
      }
    }
    connectWallet();
  }, [connect, connected]);

  const storeConnection = () => {
    setLocalStorageItem('lastConnectedWallet', {
      name: walletName,
      timestamp: Date.now(),
    });
  };

  const handleButtonClick = () => {
    // Blur the active element to avoid aria-hidden issues
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div onClick={handleButtonClick}>
      <CardanoWallet isDark={isDark} onConnected={storeConnection} />
    </div>
  );
}
