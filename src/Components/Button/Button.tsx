import { cn } from 'src/utils/className';

type ButtonProps = {
  onClick?: () => void;
  label: string;
  className?: string;
};

export default function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button
      className={cn('bg-black text-white py-2 px-4 text-body', className)}
      onClick={onClick && onClick}
    >
      {label}
    </button>
  );
}
