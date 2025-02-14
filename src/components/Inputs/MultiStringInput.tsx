import clsx from 'clsx';

type MultiStringInputProps = {
  label: string;
  inputId: string;
  values: string[];
  onChange: (inputId: string, values: string[]) => void;
  className?: string;
  inputClassName?: string;
};

export const MultiStringInput = ({
  label,
  inputId,
  values,
  onChange,
  className,
  inputClassName
}: MultiStringInputProps) => {
  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(inputId, newValues);
  };

  const addValue = () => {
    onChange(inputId, [...values, '']);
  };

  const removeValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(inputId, newValues);
  };

  return (
    <div className={clsx('my-4', className)}>
      <div className="text-callout text-gray-700">
        <label htmlFor={inputId}>{label}</label>
      </div>
      {values.map((value, index) => (
        <div key={index} className="flex items-center mb-2">
          <div className='border-b border-black w-full'>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className={clsx(
                'border-none px-1 m-0 focus-visible:ring-0 focus-visible:outline-none',
                inputClassName
              )}
            />
          </div>
          <button type="button" onClick={() => removeValue(index)} className="ml-2 btn-remove">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addValue} className="btn-add">Add</button>
    </div>
  );
}