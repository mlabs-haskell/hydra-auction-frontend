type NumberInputProps = {
  label: string;
  inputId: string;
  placeholder?: string;
  onChange?: (inputId: string, value: string) => void;
};

// TODO: Add currency symbol
export const NumberInput = ({
  label,
  inputId,
  onChange,
  placeholder,
}: NumberInputProps) => {
  return (
    <div className="border-b-2 border-black">
      <div className="text-callout mb-1 text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>

      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className="border-none p-1 m-0 mb-1"
        placeholder={placeholder ? placeholder : ''}
        type="number"
      />
    </div>
  );
};
