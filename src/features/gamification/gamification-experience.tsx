"use client";

import type { ReactNode } from "react";
import { GamificationAnalyticsTracker } from "@/features/gamification/analytics-tracker";
import { AchievementToasts } from "@/features/gamification/components/achievement-toasts";
import { GamificationProvider } from "@/features/gamification/provider";
import { GamificationTracker } from "@/features/gamification/tracker";

export function GamificationExperience({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <GamificationProvider>
      {children}
      <GamificationAnalyticsTracker />
      <GamificationTracker />
      <AchievementToasts />
    </GamificationProvider>
  );
}
