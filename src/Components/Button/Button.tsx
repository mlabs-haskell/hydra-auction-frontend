import { cn } from 'src/utils/className';

const buttonTypeStyles = {
  primary: 'bg-black text-white',
  outline: 'border border-black',
};

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: keyof typeof buttonTypeStyles;
};

// TODO: use shadcn implementation
export default function Button({
  children,
  onClick,
  className,
  type,
}: ButtonProps) {
  return (
    <button
      className={cn(
        `py-2 px-4 text-body ${
          type ? buttonTypeStyles[type] : buttonTypeStyles.primary
        }`,
        className
      )}
      onClick={onClick && onClick}
    >
      {children}
    </button>
  );
}
