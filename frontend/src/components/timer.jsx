import { useEffect, useRef, useState } from "react";

export default function Timer({ duration = 60, onTimerEnd = () => {} }) {
  const timerRef = useRef(null);
  const [count, setCount] = useState(duration);

  const stopTimer = () => {
    onTimerEnd();

    timerRef?.clear();
  };

  const handleTimer = () => {
    const start = new Date(timerRef.current);
    const now = new Date(Date.now());
    const difference = Math.floor((now - start) / 1000);

    const result = duration - difference;
    if (count !== result) setCount(result);
    if (result <= 0) stopTimer();
  };

  useEffect(() => {
    timerRef.current = Date.now();
    const interval = setInterval(handleTimer, 500);

    const handleClear = () => {
      clearInterval(interval);
    };

    timerRef.clear = handleClear;
    return handleClear;
  }, [duration]);

  const minutes = String(Math.floor((count / 60) % 60)).padStart(2, "0");
  const seconds = String(count % 60).padStart(2, "0");
  const display = `(${minutes}:${seconds})`;

  return <span className="timer">{display}</span>;
}
