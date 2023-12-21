import clsx from 'clsx';

type StringInputProps = {
  label: string;
  inputId: string;
  placeholder?: string;
  onChange?: (inputId: string, value: string) => void;
  className?: string;
};
export const StringInput = ({
  label,
  inputId,
  onChange,
  placeholder,
  className,
}: StringInputProps) => {
  return (
    <div className={clsx(' border-b border-black', className)}>
      <div className="text-callout text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>
      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className="border-none px-1 m-0 focus-visible:ring-0 focus-visible:outline-none "
        placeholder={placeholder ? placeholder : ''}
        type="text"
      />
    </div>
  );
};
