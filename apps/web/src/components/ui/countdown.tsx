"use client";

import { useEffect, useState } from "react";
import { TermStatus } from "@/components/terminal";
import { formatCountdown } from "@/lib/utils";

export function Countdown({
  target,
  label,
}: {
  target: number;
  label: string;
}) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [target]);

  return (
    <TermStatus
      label={label}
      value={formatCountdown(remaining)}
      className="text-xs"
    />
  );
}
