import clsx from 'clsx';

type StringInputProps = {
  label: string;
  inputId: string;
  placeholder?: string;
  onChange?: (inputId: string, value: string) => void;
  className?: string;
  inputClassName?: string;
};
export const StringInput = ({
  label,
  inputId,
  onChange,
  placeholder,
  className,
  inputClassName,
}: StringInputProps) => {
  return (
    <div className={clsx(className, 'border-b border-black')}>
      <div className="text-callout text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>
      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className={clsx(
          'border-none px-1 m-0 focus-visible:ring-0 focus-visible:outline-none',
          inputClassName
        )}
        placeholder={placeholder ? placeholder : ''}
        type="text"
      />
    </div>
  );
};
