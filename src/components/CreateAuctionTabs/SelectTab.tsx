import { useExtendedAssets } from 'src/hooks/api/assets';
import { useUrlParams } from 'src/hooks/urlParams';
import { DropDown } from '../DropDown/DropDown';
import { AssetExtended } from '@meshsdk/core';
import { useWallet } from '@meshsdk/react';
import { WalletApp } from 'hydra-auction-offchain';
import { useMemo } from 'react';
import { removeSpecialCharsAssetName } from 'src/utils/formatting';

const SelectTab = () => {
  const { name: walletApp } = useWallet();
  const { data: assets, isError } = useExtendedAssets(walletApp as WalletApp);

  const urlParams = useUrlParams();
  const assetUnitToList = urlParams.get('assetUnit');
  const assetIndex = useMemo(
    () => assets?.findIndex((asset) => asset.unit === assetUnitToList),
    [assetUnitToList, assets]
  );

  if (isError) {
    return null;
  }

  const onChange = (index: number) => {
    // redirect to the current page, but pass the new assetUnit
    const asset: AssetExtended | undefined = assets?.[index];
    window.location.href = `/create-auction?assetUnit=${asset?.unit}&assetName=${asset?.assetName}`;
  };

  return (
    <div className="flex flex-col pt-6">
      <div className="font-semibold">List most recently minted</div>
      <div className="text-dim mt-6">Or choose</div>

      <div className="font-semibold mt-8">NFT</div>
      <DropDown
        options={assets?.map((asset) => {
          return {
            label: removeSpecialCharsAssetName(asset.assetName),
            accessor: asset.unit || '',
          };
        })}
        title={'Select NFT'}
        defaultIndex={assetIndex || 0}
        onChange={onChange}
        className="mt-4"
      />
    </div>
  );
};
export default SelectTab;
