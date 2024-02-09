type NumberInputProps = {
  label: string;
  inputId: string;
  placeholder?: string;
  onChange?: (inputId: string, value: number) => void;
  value?: number | string;
  disabled?: boolean;
};

// TODO: Add currency symbol
export const NumberInput = ({
  label,
  inputId,
  onChange,
  placeholder,
  value,
  disabled,
}: NumberInputProps) => {
  return (
    <div className={`border-b-2 border-black`}>
      <div className="text-callout mb-1 text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>

      <input
        disabled={disabled}
        onChange={(e) => onChange && onChange(inputId, Number(e.target.value))}
        id={inputId}
        className="border-none p-1 m-0 mb-1 bg-gray-100"
        placeholder={placeholder ? placeholder : ''}
        type="number"
        value={value}
      />
    </div>
  );
};
