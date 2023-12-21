import WalletNfts from '../WalletNfts/WalletNfts';

export default function CreateAuctionList() {
  return (
    <div className="flex justify-center items-center">
      <div className="container">
        <h1 className="header text-center mb-3">My Nfts</h1>
        <div className="flex items-center justify-center">
          <div className="border-b border-gray-400 w-32"></div>
        </div>
        <WalletNfts />
      </div>
    </div>
  );
}
