import { useEffect, useRef, useState } from "react";

/** Animated number that tweens whenever the value changes. */
export function CountUp({
  value,
  className = "",
  duration = 650,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = value;
    if (a === b) return;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(a + (b - a) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      from.current = b;
    };
  }, [value, duration]);

  return <span className={className}>{shown.toLocaleString()}</span>;
}
