import { useEffect, useState } from "react";

function getRemaining(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();

  if (diff <= 0) return "Ended";

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;

  return `${hours}h ${minutes}m`;
}

export default function Countdown({ endsAt }: { endsAt: string }) {
  const [, setTick] = useState(0);
  const label = getRemaining(endsAt);

  useEffect(() => {
    const timer = setInterval(() => setTick((tick) => tick + 1), 60000);

    return () => clearInterval(timer);
  }, []);

  return <span className="font-semibold tabular-nums">{label}</span>;
}