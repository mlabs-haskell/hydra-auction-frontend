import { useIpfsImageSrc } from 'src/hooks/ipfsImageSrc';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

type IpfsImageProps = {
  assetUnit: string;
  small?: boolean;
  className?: string;
};

export default function IpfsImage({
  assetUnit,
  small = false,
  className,
}: IpfsImageProps) {
  const { data: ipfsImageSrc, isLoading } = useIpfsImageSrc(assetUnit);
  if (isLoading) return <div>Loading ...</div>;
  return (
    <ImageWrapper
      className={className}
      small={small}
      src={ipfsImageSrc || ''}
      alt="NFT"
    />
  );
}
