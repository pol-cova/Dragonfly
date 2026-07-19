"use client";

import { useEffect, useState } from "react";
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
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="font-mono text-2xl text-cyan-200 tabular-nums">
        {formatCountdown(remaining)}
      </p>
    </div>
  );
}
