import {
  ACHIEVEMENT_IDS,
  createInitialGamificationState,
  GAMIFICATION_SCHEMA_VERSION,
  TRACKED_ROUTES,
  type AchievementProgress,
  type GamificationState,
} from "@/features/gamification/types";

export const GAMIFICATION_STORAGE_KEY = "michiel-portfolio:gamification";

export type StorageAdapter = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonNegativeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function positiveTimestamp(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function readAchievementProgress(
  value: unknown,
): AchievementProgress | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const unlockedAt = positiveTimestamp(value.unlockedAt, 0);
  return unlockedAt > 0 ? { unlockedAt } : undefined;
}

export function migrateGamificationState(
  storedValue: unknown,
  now: number,
): GamificationState {
  const fallback = createInitialGamificationState(now);

  if (
    !isRecord(storedValue) ||
    (storedValue.version !== 1 &&
      storedValue.version !== 2 &&
      storedValue.version !== 3 &&
      storedValue.version !== GAMIFICATION_SCHEMA_VERSION)
  ) {
    return fallback;
  }

  const storedAchievements = isRecord(storedValue.achievements)
    ? storedValue.achievements
    : {};
  const achievements: GamificationState["achievements"] = {};
  for (const achievementId of ACHIEVEMENT_IDS) {
    const progress = readAchievementProgress(storedAchievements[achievementId]);
    if (progress) {
      achievements[achievementId] = progress;
    }
  }

  const storedCounters = isRecord(storedValue.counters)
    ? storedValue.counters
    : {};
  const storedRoutes = isRecord(storedValue.routesVisited)
    ? storedValue.routesVisited
    : {};
  const routesVisited: GamificationState["routesVisited"] = {};
  for (const route of TRACKED_ROUTES) {
    const visitedAt = positiveTimestamp(storedRoutes[route], 0);
    if (visitedAt > 0) {
      routesVisited[route] = visitedAt;
    }
  }

  const storedFlags = isRecord(storedValue.flags) ? storedValue.flags : {};
  const storedPreferences = isRecord(storedValue.preferences)
    ? storedValue.preferences
    : {};
  const storedSession = isRecord(storedValue.session) ? storedValue.session : {};
  return {
    version: GAMIFICATION_SCHEMA_VERSION,
    achievements,
    counters: {
      activeSeconds: nonNegativeNumber(storedCounters.activeSeconds),
      qualifyingActivations: nonNegativeNumber(
        storedCounters.qualifyingActivations,
      ),
    },
    routesVisited,
    flags: {
      meaningfulInteractionCompleted:
        storedFlags.meaningfulInteractionCompleted === true,
    },
    preferences: {
      soundEnabled:
        storedValue.version === GAMIFICATION_SCHEMA_VERSION
          ? storedPreferences.soundEnabled !== false
          : true,
    },
    session: {
      firstSeenAt: positiveTimestamp(storedSession.firstSeenAt, now),
    },
  };
}

export function parseGamificationState(
  serializedState: string | null,
  now: number,
): GamificationState {
  if (!serializedState) {
    return createInitialGamificationState(now);
  }

  try {
    return migrateGamificationState(JSON.parse(serializedState), now);
  } catch {
    return createInitialGamificationState(now);
  }
}

export function loadGamificationState(
  storage: StorageAdapter,
  now: number,
): GamificationState {
  try {
    return parseGamificationState(
      storage.getItem(GAMIFICATION_STORAGE_KEY),
      now,
    );
  } catch {
    return createInitialGamificationState(now);
  }
}

export function saveGamificationState(
  storage: StorageAdapter,
  state: GamificationState,
): boolean {
  try {
    storage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function removeGamificationState(storage: StorageAdapter): boolean {
  try {
    storage.removeItem(GAMIFICATION_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
