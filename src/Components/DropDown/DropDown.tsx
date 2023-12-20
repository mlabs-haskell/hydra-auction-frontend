import { useEffect, useState } from 'react';
import { OutsideAlerter } from '../OutsideAlerter/OutsideAlerter';

type DropDownItem = {
  label: string;
  accessor: string;
};

type DropDownProps = {
  options?: DropDownItem[];
  indexIn?: number;
  title: string;
};

// TODO: Should changing the nft re render the page(ie link to new assetUnit query params in url)
export const DropDown = ({ options, title, indexIn = 0 }: DropDownProps) => {
  const [activeIndex, setActiveIndex] = useState(indexIn);
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
          <div className="absolute z-10 bg-white w-full border border-gray-700">
            {options?.length &&
              options.map((option, index) => {
                return (
                  <div
                    key={index}
                    className=" p-2 cursor-pointer p-2 border-b overflow-hidden"
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
