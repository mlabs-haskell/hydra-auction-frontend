import { useEffect, useState } from 'react';
import { OutsideAlerter } from '../OutsideAlerter/OutsideAlerter';

type DropDownItem = {
  label: string;
  accessor: string;
};

type DropDownProps = {
  options?: DropDownItem[];
  defaultIndex?: number;
  title: string;
  onChange?: (index: number) => void;
};

export const DropDown = ({
  options,
  title,
  defaultIndex = 0,
  onChange,
}: DropDownProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [activeTitle, setTitle] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    options?.length && setTitle(options[activeIndex].label);
  }, [activeIndex, options]);

  const handleClick = () => {
    setShow(!show);
  };

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    setShow(false);
    onChange?.(index);
  };

  return (
    <OutsideAlerter onOutsideClick={() => setShow(false)}>
      <div className="relative">
        <div
          onClick={handleClick}
          className="text-dim cursor-pointer border-b-2 w-60 border-black p-2 mb-2"
        >
          {activeTitle || title}
        </div>
        {show && (
          <div className="absolute z-10 bg-white w-full border border-gray-700">
            {options?.length &&
              options.map((option, index) => {
                return (
                  <div
                    key={index}
                    className="cursor-pointer p-2 border-b overflow-hidden"
                    onClick={() => handleItemClick(index)}
                  >
                    {option.label}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </OutsideAlerter>
  );
};
