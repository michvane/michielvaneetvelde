"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/features/gamification/provider";

const VERIFICATION_PHRASE = "THERE ARE NO BUGS HERE";
const STARTING_TIME_MS = 4_200;
const TIME_REDUCTION_MS = 400;
const MINIMUM_TIME_MS = 700;
const CHARACTER_COUNT = VERIFICATION_PHRASE.replaceAll(" ", "").length;

type ChallengeStatus = "idle" | "running" | "failed";

function nextLetterIndex(fromIndex: number): number {
  let index = fromIndex;
  while (VERIFICATION_PHRASE[index] === " ") {
    index += 1;
  }
  return index;
}

function lettersBefore(index: number): number {
  return VERIFICATION_PHRASE.slice(0, index).replaceAll(" ", "").length;
}

function timeForIndex(index: number): number {
  return Math.max(
    MINIMUM_TIME_MS,
    STARTING_TIME_MS - lettersBefore(index) * TIME_REDUCTION_MS,
  );
}

export function BugReportChallenge() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { dispatchEvent } = useGamification();
  const [status, setStatus] = useState<ChallengeStatus>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failureMessage, setFailureMessage] = useState("");

  const failChallenge = useCallback(
    (message: string) => {
      setFailureMessage(message);
      setStatus("failed");
      dispatchEvent({ type: "bug-report-failed", at: Date.now() });
    },
    [dispatchEvent],
  );

  const currentTime = timeForIndex(currentIndex);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const timeout = window.setTimeout(() => {
      failChallenge("Request denied. Human typing speed detected.");
    }, currentTime);
    return () => window.clearTimeout(timeout);
  }, [currentIndex, currentTime, failChallenge, status]);

  function openDialog() {
    setStatus("idle");
    setCurrentIndex(0);
    setFailureMessage("");
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function startChallenge() {
    setCurrentIndex(0);
    setFailureMessage("");
    setStatus("running");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function submitLetter(letter: string) {
    if (status !== "running") {
      return;
    }

    const expectedLetter = VERIFICATION_PHRASE[currentIndex];
    if (letter.toUpperCase() !== expectedLetter) {
      failChallenge("Request denied. Typo detected. The bug has moved.");
      return;
    }

    const nextIndex = nextLetterIndex(currentIndex + 1);
    if (nextIndex >= VERIFICATION_PHRASE.length) {
      failChallenge(
        "Request denied. Suspiciously accurate. There are no bugs here.",
      );
      return;
    }

    setCurrentIndex(nextIndex);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key.length === 1) {
      event.preventDefault();
      submitLetter(event.key);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const letter = event.currentTarget.value.at(-1);
    event.currentTarget.value = "";
    if (letter) {
      submitLetter(letter);
    }
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 items-center text-left text-text-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-text"
        data-gamification-activation
        onClick={openDialog}
      >
        Report a bug
      </button>

      <dialog
        ref={dialogRef}
        className="bug-report-dialog m-auto max-h-[calc(100dvh-1rem)] w-[min(30rem,calc(100vw-1rem))] overflow-y-auto border-2 border-border-strong bg-canvas-raised p-0 text-left font-sans normal-case text-text shadow-soft sm:max-h-[calc(100dvh-2rem)] sm:w-[min(30rem,calc(100vw-2rem))]"
        aria-labelledby="bug-report-title"
        onClose={() => setStatus("idle")}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog();
          }
        }}
      >
        <div className="border-b-2 border-border-strong p-5 sm:p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="meta-label text-accent-ink">Quality assurance</p>
              <h2
                id="bug-report-title"
                className="mt-2 text-2xl font-semibold tracking-[-0.04em]"
              >
                Report a bug
              </h2>
            </div>
            <button
              type="button"
              className="-mr-2 -mt-2 inline-flex min-h-11 min-w-11 items-center justify-center text-text-muted transition-colors hover:text-text"
              aria-label="Close bug report"
              onClick={closeDialog}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {status === "idle" ? (
            <div>
              <p className="max-w-md leading-7 text-text-muted">
                Before a bug can be reported, complete one entirely reasonable
                verification check.
              </p>
              <Button className="mt-6" onClick={startChallenge}>
                Begin verification
              </Button>
            </div>
          ) : null}

          {status === "running" ? (
            <div className="relative text-center">
              <p className="meta-label text-text-muted">
                Character {lettersBefore(currentIndex) + 1} / {CHARACTER_COUNT}
              </p>
              <p
                key={currentIndex}
                className="mt-5 font-mono text-[clamp(5rem,24vw,8rem)] font-semibold leading-none tracking-[-0.08em] text-text"
                aria-live="polite"
                aria-atomic="true"
              >
                {VERIFICATION_PHRASE[currentIndex]}
              </p>

              <div className="mx-auto mt-6 h-2 max-w-sm overflow-hidden bg-surface-strong">
                <div
                  key={currentIndex}
                  className="bug-report-timer h-full bg-accent"
                  style={
                    {
                      "--challenge-duration": `${currentTime}ms`,
                    } as CSSProperties
                  }
                />
              </div>

              <input
                ref={inputRef}
                id="bug-report-letter"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="absolute bottom-0 left-1/2 h-px w-px -translate-x-1/2 opacity-0"
                aria-label={`Type the character ${VERIFICATION_PHRASE[currentIndex]}`}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
              />
              <p className="mt-5 text-sm text-text-muted" aria-hidden="true">
                Type the character shown
              </p>
            </div>
          ) : null}

          {status === "failed" ? (
            <div aria-live="polite">
              <p className="meta-label text-accent-ink">
                Verification unsuccessful
              </p>
              <p className="mt-3 text-lg font-semibold">{failureMessage}</p>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                Achievement unlocked: Report a Bug.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={startChallenge}>Try again</Button>
                <Button variant="secondary" onClick={closeDialog}>
                  Accept defeat
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
