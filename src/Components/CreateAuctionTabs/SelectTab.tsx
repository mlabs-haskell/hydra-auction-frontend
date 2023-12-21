import { useExtendedAssets } from 'src/hooks/assets';
import { getUrlParams } from 'src/utils/getUrlParams';
import { DropDown } from '../DropDown/DropDown';

const SelectTab = () => {
  const { assets, isError } = useExtendedAssets();
  if (isError) {
    return null;
  }
  const urlParams = getUrlParams();
  const assetUnitToList = urlParams.get('assetUnit');
  const assetToList = assets?.findIndex(
    (asset) => asset.unit === assetUnitToList
  );

  return (
    <div className="flex flex-col gap-8 pt-6">
      <div className="flex ">
        <div className="font-semibold">List most recently minted</div>
      </div>
      <div className="text-dim ">Or choose</div>

      <div className="">
        <div className="font-semibold">NFT</div>
      </div>
      <div>
        <DropDown
          options={assets?.map((asset) => {
            return {
              label: asset.assetName || '',
              accessor: asset.unit || '',
            };
          })}
          title={'Select NFT'}
          defaultIndex={assetToList || 0}
        />
      </div>
    </div>
  );
};
export default SelectTab;
