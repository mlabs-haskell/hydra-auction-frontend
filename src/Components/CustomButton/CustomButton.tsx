import { cn } from 'src/utils/className';

type CustomLinkProps = {
  onClick?: () => void;
  label: string;
  className?: string;
};

export default function CustomButton({
  label,
  onClick,
  className,
}: CustomLinkProps) {
  return (
    <button
      className={cn('bg-black text-white py-2 px-4 text-body', className)}
      onClick={onClick && onClick}
    >
      {label}
    </button>
  );
}
