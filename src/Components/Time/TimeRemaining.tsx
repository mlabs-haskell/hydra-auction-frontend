import { useEffect, useState } from 'react';

// Component to display the time remaining for an auction
// TODO: add color coding to warn auction is ending soon

type TimeRemainingSlotProps = {
  value: string;
  label: string;
  size?: string;
};

const TimeRemainingSlot = ({
  value,
  label,
  size = 'small',
}: TimeRemainingSlotProps) => {
  return (
    <div>
      <div
        className={`${
          size === 'large' ? 'font-bold text-title1 mb-2' : 'font-semibold mb-1'
        }`}
      >
        {value}
      </div>
      <div className="text-dim">{label}</div>
    </div>
  );
};
// TODO: FIX when a state changes, it just shows expired and the last state it needs to update the text and show new countdown
export const TimeRemaining = ({
  endDate,
  size = 'small',
}: {
  endDate: number;
  size?: string;
}) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const currentTime = Date.now();
    const timeDiff = endDate - currentTime;

    if (timeDiff < 0) return { days: null };

    const secsInMin = 60;
    const secsInHour = secsInMin * 60;
    const secsInDay = secsInHour * 24;

    const totalSeconds = Math.floor(timeDiff / 1000);
    const days = Math.floor(totalSeconds / secsInDay);
    const hours = Math.floor((totalSeconds % secsInDay) / secsInHour);
    const minutes = Math.floor((totalSeconds % secsInHour) / secsInMin);
    const seconds = totalSeconds % secsInMin;

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (size === 'large') {
    if (timeRemaining.days === null)
      return <div className="text-title1 font-bold ">Expired</div>;
    return timeRemaining.hours > 0 ? (
      <div className="grid grid-cols-3 gap-3">
        <TimeRemainingSlot
          size="large"
          value={String(timeRemaining.days)}
          label="d"
        />
        <TimeRemainingSlot
          size="large"
          value={String(timeRemaining.hours).padStart(2, '0')}
          label="hr"
        />
        <TimeRemainingSlot
          size="large"
          value={String(timeRemaining.minutes).padStart(2, '0')}
          label="min"
        />
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-3">
        <TimeRemainingSlot
          size="large"
          value={String(timeRemaining.hours).padStart(2, '0')}
          label="hr"
        />
        <TimeRemainingSlot
          size="large"
          value={String(timeRemaining.minutes).padStart(2, '0')}
          label="min"
        />
        <TimeRemainingSlot
          size="large"
          value={String(timeRemaining.seconds).padStart(2, '0')}
          label="sec"
        />
      </div>
    );
  } else {
    if (timeRemaining.days === null)
      return <div className=" font-semibold">Expired</div>;
    return timeRemaining.hours > 0 ? (
      <div className="grid grid-cols-3 gap-3">
        <TimeRemainingSlot value={String(timeRemaining.days)} label="d" />
        <TimeRemainingSlot
          value={String(timeRemaining.hours).padStart(2, '0')}
          label="hr"
        />
        <TimeRemainingSlot
          value={String(timeRemaining.minutes).padStart(2, '0')}
          label="min"
        />
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-3">
        <TimeRemainingSlot
          value={String(timeRemaining.hours).padStart(2, '0')}
          label="hr"
        />
        <TimeRemainingSlot
          value={String(timeRemaining.minutes).padStart(2, '0')}
          label="min"
        />
        <TimeRemainingSlot
          value={String(timeRemaining.seconds).padStart(2, '0')}
          label="sec"
        />
      </div>
    );
  }
};
