"use client";

import { useAction, useQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "convex/_generated/api";
import { Countdown } from "@/components/ui/countdown";
import { WingPreview } from "@/components/wing/wing-preview";

export function HomePage() {
  const [now] = useState(() => Date.now());
  const drop = useQuery(api.dropsQueries.getActive, { now });
  const teasers = useQuery(api.dropsQueries.getTeasers, { now });
  const bootstrapActiveDrop = useAction(api.dropsActions.bootstrapActiveDrop);

  useEffect(() => {
    void bootstrapActiveDrop({});
  }, [bootstrapActiveDrop]);

  const previewSeed = drop?.badgeTheme ?? "silent-signal-preview";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(245,158,11,0.12),_transparent_40%)]" />

      <section className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.45em] text-amber-400">
            Midnight Hackathon
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-6xl leading-none text-cyan-50 md:text-8xl">
            DRAGONFLY
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Solve the challenge. Prove it privately. Claim the Wing.
          </p>
          <p className="mt-3 max-w-xl text-slate-500">
            Limited-time CTF Drops with personalized puzzles and private
            completion proofs on Midnight.
          </p>
        </motion.div>

        {drop && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div className="rounded-3xl border border-cyan-500/20 bg-slate-950/60 p-8 backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-400">
                    Active Drop
                  </p>
                  <h2 className="mt-2 text-3xl text-cyan-50">{drop.name}</h2>
                  <p className="mt-2 capitalize text-slate-400">
                    {drop.difficulty} · {drop.status}
                  </p>
                </div>
                {drop.status === "active" ? (
                  <Countdown target={drop.closesAt} label="Closes in" />
                ) : drop.status === "upcoming" ? (
                  <Countdown target={drop.opensAt} label="Opens in" />
                ) : (
                  <p className="text-amber-400">Permanently closed</p>
                )}
              </div>

              <p className="mt-6 text-slate-400">{drop.story}</p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <p className="text-sm text-slate-500">
                  <span className="text-cyan-300">{drop.solverCount}</span>{" "}
                  verified solvers
                </p>
                {drop.status === "active" && (
                  <Link
                    href="/drop/drop-001"
                    className="rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-amber-400"
                  >
                    Enter Drop
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-3xl border border-amber-500/20 bg-[#041018]/80 p-8">
              <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400">
                Wing Preview
              </p>
              <div className="mt-6">
                <WingPreview badgeSeed={previewSeed} size={180} />
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Exclusive visual family — each solver receives a unique variation.
              </p>
            </div>
          </motion.div>
        )}

        {teasers && (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 p-6 opacity-60">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Upcoming
              </p>
              <h3 className="mt-2 text-xl text-slate-300">
                {teasers.upcoming.name}
              </h3>
              <p className="mt-2 text-sm text-slate-500">Transmission pending...</p>
            </div>
            <div className="rounded-2xl border border-slate-800 p-6 opacity-60">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Archived
              </p>
              <h3 className="mt-2 text-xl text-slate-300">
                {teasers.archived.name}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {teasers.archived.solverCount} solvers · Wing unavailable
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
