import { useEffect, useState } from 'react';
import { OutsideAlerter } from '../OutsideAlerter/OutsideAlerter';

type DropDownItem = {
  label: string;
  accessor: string;
};

type DropDownProps = {
  options?: DropDownItem[];
  title: string;
};

export const DropDown = ({ options, title }: DropDownProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTitle, setTitle] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };
  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    setShow(false);
  };
  useEffect(() => {
    options?.length && setTitle(options[activeIndex].label);
  }, [activeIndex]);
  return (
    <OutsideAlerter onOutsideClick={() => setShow(false)}>
      <div className="relative">
        <div
          onClick={handleClick}
          className="text-dim cursor-pointer border-b-2 w-60 border-black p-2 mb-6"
        >
          {activeTitle || title}
        </div>
        {show && (
          <div className="absolute z-10 bg-gray-100 w-full">
            {options?.length &&
              options.map((option, index) => {
                return (
                  <div
                    key={index}
                    className="text-dim p-2 cursor-pointer p-2 border-b overflow-hidden"
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
