"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  achievementDefinitions,
  BUTTON_ENTHUSIAST_THRESHOLD,
  TOUCH_GRASS_SECONDS,
} from "@/features/gamification/achievements";
import { useGamification } from "@/features/gamification/provider";
import { playAchievementChime } from "@/features/gamification/sound";
import {
  ACHIEVEMENT_IDS,
  type AchievementId,
  type GamificationState,
} from "@/features/gamification/types";

function hasProgress(progress: GamificationState): boolean {
  return (
    Object.keys(progress.achievements).length > 0 ||
    progress.counters.activeSeconds > 0 ||
    progress.counters.qualifyingActivations > 0 ||
    Object.keys(progress.routesVisited).length > 1
  );
}

function achievementProgress(
  achievementId: AchievementId,
  progress: GamificationState,
): string {
  switch (achievementId) {
    case "button-enthusiast":
      return `${progress.counters.qualifyingActivations}/${BUTTON_ENTHUSIAST_THRESHOLD} activations`;
    case "touch-grass":
      return `${Math.floor(progress.counters.activeSeconds)}/${TOUCH_GRASS_SECONDS} active seconds`;
    default:
      return achievementDefinitions[achievementId].hint;
  }
}

export function AchievementHud() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { dispatchEvent, isReady, progress, resetProgress } = useGamification();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const earnedCount = Object.keys(progress.achievements).length;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closePanel() {
      setIsOpen(false);
      setIsResetting(false);
    }

    function handleOutsideClick(event: MouseEvent) {
      const root = rootRef.current;
      if (root && !event.composedPath().includes(root)) {
        closePanel();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePanel();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function confirmReset() {
    resetProgress();
    setIsResetting(false);
  }

  function toggleSound() {
    const enabled = !progress.preferences.soundEnabled;
    if (enabled) {
      playAchievementChime();
    }
    dispatchEvent({ type: "sound-preference-changed", enabled });
  }

  return (
    <div ref={rootRef} className="relative z-40 justify-self-start">
      <button
        ref={triggerRef}
        type="button"
        className="group inline-flex min-h-11 items-center gap-2 border border-border-strong px-2.5 text-xs font-semibold tabular-nums transition-colors hover:bg-surface sm:px-3"
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={`${earnedCount} of ${ACHIEVEMENT_IDS.length} achievements. ${isOpen ? "Close" : "Open"} achievement list`}
        aria-busy={!isReady}
        data-gamification-activation
        onClick={() => {
          setIsOpen((open) => !open);
          setIsResetting(false);
        }}
      >
        <span
          aria-hidden="true"
          className="inline-flex h-5 w-5 items-center justify-center bg-accent text-xs text-accent-contrast transition-transform group-hover:-rotate-6"
        >
          ✦
        </span>
        <span>
          {earnedCount}/{ACHIEVEMENT_IDS.length}
        </span>
        <span className="hidden text-text-muted sm:inline">Achievements</span>
      </button>

      <section
        id={panelId}
        className="achievement-panel absolute left-0 top-[calc(100%+0.75rem)] max-h-[min(42rem,calc(100vh-6.5rem))] w-[min(22rem,calc(100vw-2.5rem))] origin-top-left overflow-y-auto border-2 border-border-strong bg-canvas-raised shadow-soft"
        data-state={isOpen ? "open" : "closed"}
        aria-labelledby={`${panelId}-title`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="border-b-2 border-border-strong p-5">
          <p id={`${panelId}-title`} className="meta-label text-accent-ink">
            Achievements
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-text-muted">
            A record of the completely optional things you found.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div
              className="h-1 flex-1 bg-surface-strong"
              role="progressbar"
              aria-label="Achievements completed"
              aria-valuemin={0}
              aria-valuemax={ACHIEVEMENT_IDS.length}
              aria-valuenow={earnedCount}
            >
              <div
                className="h-full bg-accent transition-[width] duration-500"
                style={{
                  width: `${(earnedCount / ACHIEVEMENT_IDS.length) * 100}%`,
                }}
              />
            </div>
            <p className="shrink-0 text-xs text-text-muted">
              {earnedCount}/{ACHIEVEMENT_IDS.length} complete
            </p>
          </div>
        </div>

        <ol className="divide-y divide-border">
          {ACHIEVEMENT_IDS.map((achievementId, index) => {
            const achievement = achievementDefinitions[achievementId];
            const unlocked = Boolean(progress.achievements[achievementId]);

            return (
              <li
                key={achievementId}
                className={`flex gap-3 p-4 ${unlocked ? "bg-accent-soft/25" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[0.625rem] font-bold ${
                    unlocked
                      ? "border-accent bg-accent text-accent-contrast"
                      : "border-border-strong text-text-muted"
                  }`}
                >
                  {unlocked ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{achievement.title}</p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    {achievement.description}
                  </p>
                  <p className="meta-label mt-2 text-text-muted">
                    {unlocked
                      ? "Completed"
                      : achievementProgress(achievementId, progress)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="border-t-2 border-border-strong p-4">
          {isResetting ? (
            <div>
              <p className="text-sm font-semibold">Reset local progress?</p>
              <p className="mt-1 text-xs leading-5 text-text-muted">
                Achievements on this device will be cleared.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="min-h-11 flex-1 border border-border-strong px-3 text-xs font-semibold transition-colors hover:bg-surface"
                  onClick={confirmReset}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="min-h-11 flex-1 border border-transparent px-3 text-xs text-text-muted transition-colors hover:text-text"
                  onClick={() => setIsResetting(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="min-h-11 text-xs font-semibold text-text-muted transition-colors hover:text-text"
                aria-pressed={progress.preferences.soundEnabled}
                onClick={toggleSound}
              >
                Sound {progress.preferences.soundEnabled ? "on" : "off"}
              </button>
              <button
                type="button"
                className="min-h-11 text-xs text-text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!hasProgress(progress)}
                onClick={() => setIsResetting(true)}
              >
                Reset progress
              </button>
            </div>
          )}
          <p className="mt-2 text-[0.6875rem] leading-5 text-text-muted">
            Saved only in this browser.
          </p>
        </div>
      </section>
    </div>
  );
}
