"use client";

import { useEffect, useRef, useState } from "react";
import { achievementDefinitions } from "@/features/gamification/achievements";
import { useGamification } from "@/features/gamification/provider";
import { playAchievementChime } from "@/features/gamification/sound";
import type { GamificationEffect } from "@/features/gamification/types";

const TOAST_VISIBLE_MS = 5_200;
const TOAST_EXIT_MS = 280;

type AchievementEffect = GamificationEffect & { key: string };

function AchievementToast({
  dismissEffect,
  effect,
  soundEnabled,
}: Readonly<{
  dismissEffect: (key: string) => void;
  effect: AchievementEffect;
  soundEnabled: boolean;
}>) {
  const [isLeaving, setIsLeaving] = useState(false);
  const soundEnabledOnMount = useRef(soundEnabled);
  const achievement = achievementDefinitions[effect.achievementId];

  useEffect(() => {
    if (soundEnabledOnMount.current) {
      playAchievementChime();
    }

    const timeout = window.setTimeout(
      () => setIsLeaving(true),
      TOAST_VISIBLE_MS,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLeaving) {
      return;
    }

    const timeout = window.setTimeout(
      () => dismissEffect(effect.key),
      TOAST_EXIT_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [dismissEffect, effect.key, isLeaving]);

  return (
    <div
      className="pointer-events-none fixed inset-x-5 bottom-5 z-50 sm:inset-x-auto sm:bottom-auto sm:right-8 sm:top-24 sm:w-80"
      aria-live="polite"
      aria-atomic="true"
    >
      <button
        type="button"
        className="achievement-toast pointer-events-auto block w-full cursor-pointer overflow-hidden border-2 border-border-strong bg-canvas-raised text-left text-text shadow-soft transition-colors hover:bg-surface"
        data-state={isLeaving ? "leaving" : "entering"}
        aria-label={`Dismiss achievement notification: ${achievement.title}`}
        onClick={() => setIsLeaving(true)}
      >
        <span className="flex items-start gap-4 p-5">
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-accent text-lg text-accent-contrast"
          >
            ✦
          </span>
          <span className="min-w-0 flex-1">
            <span className="meta-label block text-accent-ink">
              Achievement completed
            </span>
            <span className="mt-2 block font-semibold tracking-[-0.025em]">
              {achievement.title}
            </span>
            <span className="mt-1 block text-sm leading-5 text-text-muted">
              {achievement.description}
            </span>
            <span className="meta-label mt-3 block text-accent-ink">
              Unlocked
            </span>
          </span>
          <span
            aria-hidden="true"
            className="-mr-2 -mt-2 inline-flex min-h-11 min-w-11 items-center justify-center text-text-muted"
          >
            ×
          </span>
        </span>
        <span aria-hidden="true" className="block h-1 bg-surface-strong">
          <span className="achievement-toast-timer block h-full bg-accent" />
        </span>
      </button>
    </div>
  );
}

export function AchievementToasts() {
  const { dismissEffect, effects, progress } = useGamification();
  const achievementEffect = effects.find(
    (effect): effect is AchievementEffect =>
      effect.type === "achievement-earned",
  );

  if (!achievementEffect) {
    return <div aria-live="polite" aria-atomic="true" />;
  }

  return (
    <AchievementToast
      key={achievementEffect.key}
      dismissEffect={dismissEffect}
      effect={achievementEffect}
      soundEnabled={progress.preferences.soundEnabled}
    />
  );
}
