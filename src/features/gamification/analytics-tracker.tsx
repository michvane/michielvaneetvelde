"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/features/analytics/analytics";
import { useGamification } from "@/features/gamification/provider";

export function GamificationAnalyticsTracker() {
  const { effects } = useGamification();
  const trackedEffectKeys = useRef(new Set<string>());

  useEffect(() => {
    for (const effect of effects) {
      if (
        effect.type !== "achievement-earned" ||
        trackedEffectKeys.current.has(effect.key)
      ) {
        continue;
      }

      trackedEffectKeys.current.add(effect.key);
      trackAnalyticsEvent("achievement_unlocked", {
        achievement: effect.achievementId,
      });
    }
  }, [effects]);

  return null;
}
