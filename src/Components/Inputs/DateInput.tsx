import { useState } from 'react';
import { formatDate } from 'src/utils/date';

type DateTimeInputProps = {
  label: string;
  inputId: string;
  placeholder?: string;
  onChange?: (inputId: string, value: string) => void;
};

export const DateTimeInput = ({
  label,
  inputId,
  onChange,
  placeholder,
}: DateTimeInputProps) => {
  const [value, setValue] = useState<string>('');
  // If we want to set the date value on the input from epoch time we need this
  // const splitDate = new Date(Number(placeholder) ).toLocaleDateString().replaceAll('/', '-').split('-');
  // const formattedDate = `${splitDate[2]}-${Number(splitDate[0]) < 10 ? '0' + splitDate[0] : splitDate[0]}-${Number(splitDate[1]) < 10 ? '0' + splitDate[1] : splitDate[1]}`;
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
          setValue(formattedDate);
        }}
        onBlur={(e) => {
          if (e.target.value !== '') return;

          const formattedDate = formatDate(new Date());
          onChange &&
            onChange(inputId, new Date(formattedDate).getTime().toString());
          setValue(formattedDate);
        }}
        id={inputId}
        className="border-none p-1 m-0 mb-1"
        type="datetime-local"
        value={value}
      />
    </div>
  );
};
