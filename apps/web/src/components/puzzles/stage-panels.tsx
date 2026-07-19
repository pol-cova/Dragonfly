"use client";

import { useState } from "react";
import type { StageContent } from "@dragonfly/shared";
import { decodeStage1Fragment } from "@dragonfly/drop-engine";
import { TermButton, TermInput, TermPanel } from "@/components/terminal";

type StageProps = {
  stage: StageContent;
  onSubmit: (answer: string) => void;
  submitting: boolean;
  shake?: boolean;
};

export function StageRecon({ stage, onSubmit, submitting, shake }: StageProps) {
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
    <div className="space-y-3">
      <TermPanel>
        <p className="font-mono text-xs text-[var(--fg-dim)]">
          channel: {payload.channel ?? "unknown"}
        </p>
        <p className="mt-2 break-all font-mono text-sm text-[var(--fg)]">
          {payload.waveform}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <TermButton type="button" onClick={() => setRevealed(true)}>
            inspect metadata
          </TermButton>
          {decodedFragment && (
            <span className="font-mono text-sm text-[var(--fg-warn)]">
              {decodedFragment}
            </span>
          )}
        </div>
      </TermPanel>
      <TermInput
        placeholder="fragment_a"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        busy={submitting}
        shake={shake}
        onSubmitValue={(value) => {
          setAnswer(value);
          onSubmit(value);
        }}
      />
    </div>
  );
}

export function StageCrypto({ stage, onSubmit, submitting, shake }: StageProps) {
  const payload = stage.payload as {
    fragmentA: string;
    cipherKey: string;
    cipherText: string;
  };
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-3">
      <TermPanel>
        <p className="font-mono text-sm text-[var(--fg-dim)]">
          fragment A: {payload.fragmentA}
        </p>
        <p className="font-mono text-sm text-[var(--fg-dim)]">
          flight key: {payload.cipherKey}
        </p>
        <p className="mt-3 font-terminal text-2xl tracking-wide text-[var(--fg-warn)]">
          {payload.cipherText}
        </p>
      </TermPanel>
      <TermInput
        placeholder="decoded_plaintext"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        busy={submitting}
        shake={shake}
        submitLabel="decode"
        onSubmitValue={(value) => {
          setAnswer(value);
          onSubmit(value);
        }}
      />
    </div>
  );
}

export function StageCore({ stage, onSubmit, submitting, shake }: StageProps) {
  const payload = stage.payload as {
    fragmentA: string;
    fragmentB: string;
    flightTail: string;
    coreClue: string;
    terminalPrompt: string;
  };
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-3">
      <TermPanel>
        <p className="font-mono text-sm text-[var(--fg-dim)]">
          {payload.terminalPrompt}
        </p>
        <div className="mt-3 space-y-1 font-mono text-sm">
          <p>A={payload.fragmentA}</p>
          <p>B={payload.fragmentB}</p>
          <p>tail={payload.flightTail}</p>
          <p className="text-[var(--fg-warn)]">clue={payload.coreClue}</p>
        </div>
      </TermPanel>
      <TermInput
        placeholder="reconstruct --silent ..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        busy={submitting}
        shake={shake}
        submitLabel="execute"
        onSubmitValue={(value) => {
          setAnswer(value);
          onSubmit(value);
        }}
      />
    </div>
  );
}
