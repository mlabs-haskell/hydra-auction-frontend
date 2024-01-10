import { useEffect, useState } from 'react';

// Component to display the time remaining for an auction
// TODO: add color coding to warn auction is ending soon
export const TimeRemaining = ({ endDate }: { endDate: number }) => {
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

  if (timeRemaining.days === null) return <>Expired</>;

  if (timeRemaining.days > 0) {
    return (
      <>
        {timeRemaining.days} {timeRemaining.days === 1 ? 'day' : 'days'}{' '}
        remaining
      </>
    );
  }

  return (
    <>
      {String(timeRemaining.hours).padStart(2, '0')}:
      {String(timeRemaining.minutes).padStart(2, '0')}:
      {String(timeRemaining.seconds).padStart(2, '0')} remaining
    </>
  );
};
