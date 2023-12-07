type StringInputProps = {
  label: string;
  inputId: string;
  placeholder?: string;
  onChange?: (inputId: string, value: string) => void;
};
export const StringInput = ({
  label,
  inputId,
  onChange,
  placeholder,
}: StringInputProps) => {
  return (
    <div className="mb-2">
      <div className="text-sm mb-1 text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>
      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className=""
        placeholder={placeholder ? placeholder : ''}
        type="text"
      />
    </div>
  );
};
