import { describe, expect, it } from "vitest";
import {
  GAMIFICATION_STORAGE_KEY,
  loadGamificationState,
  migrateGamificationState,
  parseGamificationState,
  saveGamificationState,
  type StorageAdapter,
} from "@/features/gamification/persistence";
import { createInitialGamificationState } from "@/features/gamification/types";

class MemoryStorage implements StorageAdapter {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("gamification persistence", () => {
  it("enables achievement sounds by default", () => {
    expect(createInitialGamificationState(1_000).preferences.soundEnabled).toBe(
      true,
    );
  });

  it("round-trips valid progress", () => {
    const storage = new MemoryStorage();
    const state = {
      ...createInitialGamificationState(1_000),
      achievements: {
        "hello-world": { unlockedAt: 2_000 },
      },
    };

    expect(saveGamificationState(storage, state)).toBe(true);
    expect(loadGamificationState(storage, 3_000)).toEqual(state);
  });

  it("falls back safely for malformed JSON and unknown versions", () => {
    expect(parseGamificationState("not-json", 4_000)).toEqual(
      createInitialGamificationState(4_000),
    );
    expect(migrateGamificationState({ version: 99 }, 5_000)).toEqual(
      createInitialGamificationState(5_000),
    );
  });

  it("validates nested values and ignores invented achievements and routes", () => {
    const migrated = migrateGamificationState(
      {
        version: 3,
        achievements: {
          "hello-world": { unlockedAt: 2_000 },
          invented: { unlockedAt: 2_000 },
        },
        counters: {
          activeSeconds: "thirty",
          qualifyingActivations: 3,
        },
        routesVisited: {
          home: 1_500,
          secret: 1_600,
        },
        flags: { meaningfulInteractionCompleted: true },
        preferences: { soundEnabled: true },
        session: { firstSeenAt: -1 },
      },
      6_000,
    );

    expect(migrated.achievements).toEqual({
      "hello-world": { unlockedAt: 2_000 },
    });
    expect(migrated.counters).toEqual({
      activeSeconds: 0,
      qualifyingActivations: 3,
    });
    expect(migrated.routesVisited).toEqual({ home: 1_500 });
    expect(migrated.preferences.soundEnabled).toBe(true);
    expect(migrated.session.firstSeenAt).toBe(6_000);
  });

  it("preserves achievements from the retired Bits and Points schemas", () => {
    for (const version of [1, 2]) {
      const migrated = migrateGamificationState(
        {
          version,
          achievements: {
            "hello-world": { unlockedAt: 2_000 },
            "touch-grass": { unlockedAt: 3_000 },
          },
        },
        6_500,
      );

      expect(migrated.achievements).toEqual({
        "hello-world": { unlockedAt: 2_000 },
        "touch-grass": { unlockedAt: 3_000 },
      });
      expect(migrated.preferences.soundEnabled).toBe(true);
    }
  });

  it("moves existing progress to the new sound-on default", () => {
    const migrated = migrateGamificationState(
      {
        version: 3,
        preferences: { soundEnabled: false },
      },
      6_750,
    );

    expect(migrated.preferences.soundEnabled).toBe(true);
  });

  it("preserves an explicit sound preference in the current schema", () => {
    const migrated = migrateGamificationState(
      {
        version: 4,
        preferences: { soundEnabled: false },
      },
      6_800,
    );

    expect(migrated.preferences.soundEnabled).toBe(false);
  });

  it("uses in-memory defaults when storage access fails", () => {
    const brokenStorage: StorageAdapter = {
      getItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    };

    expect(loadGamificationState(brokenStorage, 7_000)).toEqual(
      createInitialGamificationState(7_000),
    );
    expect(
      saveGamificationState(
        brokenStorage,
        createInitialGamificationState(7_000),
      ),
    ).toBe(false);
  });

  it("stores data under a stable namespaced key", () => {
    expect(GAMIFICATION_STORAGE_KEY).toBe("michiel-portfolio:gamification");
  });
});
