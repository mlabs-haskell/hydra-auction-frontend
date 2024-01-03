import { useExtendedAssets } from 'src/hooks/assets';
import { getUrlParams } from 'src/utils/getUrlParams';
import { DropDown } from '../DropDown/DropDown';
import { AssetExtended } from '@meshsdk/core';

const SelectTab = () => {
  const { assets, isError } = useExtendedAssets();

  if (isError) {
    return null;
  }
  const urlParams = getUrlParams();
  const assetUnitToList = urlParams.get('assetUnit');
  const assetIndex = assets?.findIndex(
    (asset) => asset.unit === assetUnitToList
  );

  const onChange = (index: number) => {
    // redirect to the current page, but pass the new assetUnit
    const asset: AssetExtended | undefined = assets?.[index];
    window.location.href = `/create-auction?assetUnit=${asset?.unit}`;
  };

  return (
    <div className="flex flex-col pt-6">
      <div className="font-semibold">List most recently minted</div>
      <div className="text-dim mt-6">Or choose</div>

      <div className="font-semibold mt-8">NFT</div>
      <DropDown
        options={assets?.map((asset) => {
          return {
            label: asset.assetName || '',
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
