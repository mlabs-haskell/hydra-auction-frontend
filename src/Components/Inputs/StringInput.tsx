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
    <div className=" border-b border-black">
      <div className="text-callout text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>
      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className="border-none p-1 m-0 mb-1"
        placeholder={placeholder ? placeholder : ''}
        type="text"
      />
    </div>
  );
};
