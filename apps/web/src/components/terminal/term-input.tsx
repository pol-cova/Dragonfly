"use client";

import {
  type FormEvent,
  type InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import { TermButton } from "./term-button";

export function TermInput({
  prompt = "$",
  submitLabel = "submit",
  onSubmitValue,
  className,
  formClassName,
  showSubmit = true,
  autoFocus = true,
  busy = false,
  shake = false,
  ...inputProps
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onSubmit"> & {
  prompt?: string;
  submitLabel?: string;
  onSubmitValue?: (value: string) => void;
  formClassName?: string;
  showSubmit?: boolean;
  autoFocus?: boolean;
  busy?: boolean;
  shake?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus, inputProps.disabled, busy]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = String(data.get("command") ?? "").trim();
    if (!value || inputProps.disabled || busy) return;
    onSubmitValue?.(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-stretch",
        shake && "term-shake",
        formClassName,
      )}
    >
      <label
        className={cn(
          "term-input-wrap flex min-w-0 flex-1 items-center gap-2 border border-[var(--border)] bg-[var(--bg)] px-3 py-2",
          busy && "is-busy",
          className,
        )}
      >
        <span className="shrink-0 font-mono text-sm text-[var(--fg-dim)]">
          {prompt}
        </span>
        <input
          ref={inputRef}
          name="command"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)]"
          {...inputProps}
        />
      </label>
      {showSubmit ? (
        <TermButton type="submit" disabled={inputProps.disabled || busy}>
          {busy ? "..." : submitLabel}
        </TermButton>
      ) : null}
    </form>
  );
}
