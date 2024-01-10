import WalletNfts from '../WalletNfts/WalletNfts';

export default function CreateAuctionList() {
  return (
    <>
      <div className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-title1 mb-4">My Nfts</h1>
        <hr className="border-b border-gray-400 w-32" />
      </div>
      <WalletNfts />
    </>
  );
}
