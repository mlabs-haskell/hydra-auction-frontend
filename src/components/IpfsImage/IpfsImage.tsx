import ImageWrapper from '../ImageWrapper/ImageWrapper';
import { useAssetMetadata } from 'src/hooks/api/assets';

type IpfsImageProps = {
  small?: boolean;
  className?: string;
  assetUnit: string;
};

export default function IpfsImage({
  small = false,
  className,
  assetUnit,
}: IpfsImageProps) {
  const { data: assetMetadata, isLoading } = useAssetMetadata(assetUnit);
  const src = isLoading ? './images/loading_nft.png' : assetMetadata?.image || './images/loading_nft.png';
  return (
    <ImageWrapper
      className={className}
      small={small}
      src={src}
      alt="NFT"
    />
  );
}
