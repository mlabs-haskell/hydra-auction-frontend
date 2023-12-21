import { useEffect, useState } from 'react';
import { OutsideAlerter } from '../OutsideAlerter/OutsideAlerter';
import clsx from 'clsx';

type DropDownItem = {
  label: string;
  accessor: string;
};

type DropDownProps = {
  options?: DropDownItem[];
  defaultIndex?: number;
  title: string;
  onChange?: (index: number) => void;
  className?: string;
};

export const DropDown = ({
  options,
  title,
  defaultIndex = 0,
  onChange,
  className,
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
          className={clsx(
            'text-dim cursor-pointer border-b-2 min-w-60 border-black p-2 mb-2',
            className
          )}
        >
          {activeTitle || title}
        </div>
        {show && (
          <div className="absolute z-10 bg-white w-fit border border-gray-700">
            {options?.length &&
              options.map((option, index) => {
                return (
                  <div
                    key={index}
                    className="cursor-pointer px-4 py-2 border-b overflow-hidden  hover:bg-slate-100"
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
