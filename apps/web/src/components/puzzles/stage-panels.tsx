"use client";

import { useState } from "react";
import type { StageContent } from "@dragonfly/shared";
import { decodeStage1Fragment } from "@dragonfly/drop-engine";

export function StageRecon({
  stage,
  onSubmit,
  loading,
}: {
  stage: StageContent;
  onSubmit: (answer: string) => void;
  loading: boolean;
}) {
  const payload = stage.payload as {
    channel?: string;
    waveform?: string;
    metadataHint?: string;
    location?: { channel: string; marker: string };
  };
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");

  const decodedFragment =
    revealed && payload.waveform && payload.metadataHint && payload.location
      ? decodeStage1Fragment({
          location: payload.location,
          waveform: payload.waveform,
          metadataHint: payload.metadataHint,
          channel: payload.channel ?? payload.location.channel,
        })
      : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-[#041018] p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
          Transmission Interface
        </p>
        <div className="mt-4 font-mono text-xs text-cyan-200/70">
          <p>CHANNEL: {payload.channel ?? "unknown"}</p>
          <p className="mt-2 break-all">WAVEFORM: {payload.waveform}</p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-4 rounded border border-cyan-500/30 px-3 py-1 text-cyan-300 hover:bg-cyan-500/10"
          >
            Inspect {payload.channel} metadata ({payload.metadataHint})
          </button>
          {decodedFragment && (
            <p className="mt-3 text-amber-300">
              Extracted signal body: {decodedFragment}
            </p>
          )}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(answer);
        }}
        className="flex gap-3"
      >
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter Fragment A"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-cyan-100 outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export function StageCrypto({
  stage,
  onSubmit,
  loading,
}: {
  stage: StageContent;
  onSubmit: (answer: string) => void;
  loading: boolean;
}) {
  const payload = stage.payload as {
    fragmentA: string;
    cipherKey: string;
    cipherText: string;
  };
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-[#041018] p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
          Cipher Grid
        </p>
        <div className="mt-4 grid gap-3 font-mono text-sm text-cyan-100">
          <p>Fragment A: {payload.fragmentA}</p>
          <p>Flight Key: {payload.cipherKey}</p>
          <p className="text-2xl tracking-widest text-amber-300">
            {payload.cipherText}
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(answer);
        }}
        className="flex gap-3"
      >
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Decoded plaintext"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-cyan-100 outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          Decode
        </button>
      </form>
    </div>
  );
}

export function StageCore({
  stage,
  onSubmit,
  loading,
}: {
  stage: StageContent;
  onSubmit: (answer: string) => void;
  loading: boolean;
}) {
  const payload = stage.payload as {
    fragmentA: string;
    fragmentB: string;
    flightTail: string;
    coreClue: string;
    terminalPrompt: string;
  };
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-black p-6 font-mono text-sm">
        <p className="text-emerald-400">{payload.terminalPrompt}</p>
        <p className="mt-4 text-slate-500"># fragments loaded</p>
        <p className="text-cyan-300">A={payload.fragmentA}</p>
        <p className="text-cyan-300">B={payload.fragmentB}</p>
        <p className="text-cyan-300">tail={payload.flightTail}</p>
        <p className="text-amber-400">clue={payload.coreClue}</p>
        <p className="mt-4 flex items-center gap-2 text-emerald-300">
          <span>$</span>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            placeholder="reconstruct --silent ..."
          />
        </p>
      </div>
      <button
        type="button"
        onClick={() => onSubmit(answer)}
        disabled={loading}
        className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
      >
        Execute Signal Reconstruction
      </button>
    </div>
  );
}
