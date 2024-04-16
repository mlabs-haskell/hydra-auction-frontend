import React, { useRef, useEffect, ReactNode } from 'react';

interface OutsideAlerterProps {
  children: ReactNode;
  onOutsideClick: () => void;
}

function useOutsideAlerter(
  ref: React.RefObject<HTMLDivElement>,
  clickEvent: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        clickEvent();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, clickEvent]);
}

export const OutsideAlerter: React.FC<OutsideAlerterProps> = (props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, props.onOutsideClick);

  return <div ref={wrapperRef}>{props.children}</div>;
};
