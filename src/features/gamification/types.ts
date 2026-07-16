export const ACHIEVEMENT_IDS = [
  "hello-world",
  "button-enthusiast",
  "touch-grass",
  "recruiter-any-percent",
  "offline-mode",
  "open-channel",
  "report-a-bug",
  "chiaroscuro",
  "completionist",
] as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

export const TRACKED_ROUTES = ["home", "resume", "contact", "play"] as const;

export type TrackedRoute = (typeof TRACKED_ROUTES)[number];

export const GAMIFICATION_SCHEMA_VERSION = 4 as const;

export type AchievementProgress = {
  unlockedAt: number;
};

export type GamificationState = {
  version: typeof GAMIFICATION_SCHEMA_VERSION;
  achievements: Partial<Record<AchievementId, AchievementProgress>>;
  counters: {
    activeSeconds: number;
    qualifyingActivations: number;
  };
  routesVisited: Partial<Record<TrackedRoute, number>>;
  flags: {
    meaningfulInteractionCompleted: boolean;
  };
  preferences: {
    soundEnabled: boolean;
  };
  session: {
    firstSeenAt: number;
  };
};

export type GamificationEvent =
  | { type: "meaningful-interaction-completed"; at: number }
  | { type: "qualifying-activation"; at: number }
  | { type: "active-time-elapsed"; at: number; seconds: number }
  | { type: "route-visited"; at: number; route: TrackedRoute }
  | { type: "resume-opened"; at: number }
  | { type: "resume-downloaded"; at: number }
  | { type: "contact-opened"; at: number }
  | { type: "bug-report-failed"; at: number }
  | { type: "theme-changed"; at: number }
  | { type: "sound-preference-changed"; enabled: boolean };

export type GamificationEffect = {
  type: "achievement-earned";
  achievementId: AchievementId;
  occurredAt: number;
};

export type EngineResult = {
  state: GamificationState;
  effects: readonly GamificationEffect[];
};

export function createInitialGamificationState(now: number): GamificationState {
  return {
    version: GAMIFICATION_SCHEMA_VERSION,
    achievements: {},
    counters: {
      activeSeconds: 0,
      qualifyingActivations: 0,
    },
    routesVisited: {},
    flags: {
      meaningfulInteractionCompleted: false,
    },
    preferences: {
      soundEnabled: true,
    },
    session: {
      firstSeenAt: now,
    },
  };
}
