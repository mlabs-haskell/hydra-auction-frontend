type ImageWrapperProps = React.HTMLProps<HTMLImageElement> & {
  src: string;
  alt: string;
  small?: boolean;
};

const LARGE_IMAGE_WIDTH = 500;
const SMALL_IMAGE_WIDTH = 246;

export default function ImageWrapper({
  src,
  alt,
  className,
  small = false,
}: ImageWrapperProps) {
  return (
    <img
      className={className}
      width={small ? SMALL_IMAGE_WIDTH : LARGE_IMAGE_WIDTH}
      alt={alt}
      src={src}
    />
  );
}
