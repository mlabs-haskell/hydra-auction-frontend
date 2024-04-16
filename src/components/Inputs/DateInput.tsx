import { useState } from 'react';
import { formatDate } from 'src/utils/date';

type DateTimeInputProps = {
  label: string;
  inputId: string;
  placeholder?: string;
  inputValue?: string;
  onChange?: (inputId: string, value: string) => void;
};

export const DateTimeInput = ({
  label,
  inputId,
  onChange,
  placeholder,
  inputValue,
}: DateTimeInputProps) => {
  const [value, setValue] = useState<string>(inputValue || '');
  return (
    <div className="border-b-2 border-black">
      <div className="text-callout mb-1 text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>

      <input
        onChange={(e) => {
          const formattedDate = formatDate(new Date(e.target.value));
          onChange &&
            onChange(inputId, new Date(formattedDate).getTime().toString());
          !inputValue && setValue(formattedDate);
        }}
        id={inputId}
        className="border-none p-1 m-0 mb-1 bg-gray-100"
        type="datetime-local"
        placeholder={placeholder}
        value={inputValue ? inputValue : value}
      />
    </div>
  );
};
