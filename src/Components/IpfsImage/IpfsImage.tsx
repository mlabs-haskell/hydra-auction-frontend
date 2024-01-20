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
  if (isLoading) return <div>Loading ...</div>;

  return (
    <ImageWrapper
      className={className}
      small={small}
      src={assetMetadata?.image || ''}
      alt="NFT"
    />
  );
}
