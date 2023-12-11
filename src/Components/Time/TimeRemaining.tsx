import { useEffect, useState } from 'react';

// Component to display the time remaining for an auction
// TODO: add color coding to warn auction is ending soon
export const TimeRemaining = ({ endDate }: { endDate: number }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = endDate - currentTime;

    if (timeDiff < 0) return { days: null };
    const days = Math.floor(timeDiff / (60 * 60 * 24));
    const hours = Math.floor((timeDiff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
    const seconds = timeDiff % 60;

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
