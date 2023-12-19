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
  // If we want to set the date value on the input from epoch time we need this
  // const splitDate = new Date(Number(placeholder) ).toLocaleDateString().replaceAll('/', '-').split('-');
  // const formattedDate = `${splitDate[2]}-${Number(splitDate[0]) < 10 ? '0' + splitDate[0] : splitDate[0]}-${Number(splitDate[1]) < 10 ? '0' + splitDate[1] : splitDate[1]}`;
  return (
    <div className="border-b-2 border-black">
      <div className="text-callout mb-1 text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>

      <input
        onChange={(e) =>
          onChange &&
          onChange(inputId, new Date(e.target.value).getTime().toString())
        }
        id={inputId}
        className="border-none p-1 m-0 mb-1"
        type="datetime-local"
      />
    </div>
  );
};
