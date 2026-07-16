"use client";

import type { ReactNode } from "react";
import { AchievementToasts } from "@/features/gamification/components/achievement-toasts";
import { GamificationProvider } from "@/features/gamification/provider";
import { GamificationTracker } from "@/features/gamification/tracker";

export function GamificationExperience({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <GamificationProvider>
      {children}
      <GamificationTracker />
      <AchievementToasts />
    </GamificationProvider>
  );
}
