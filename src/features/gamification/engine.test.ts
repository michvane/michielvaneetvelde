import { describe, expect, it } from "vitest";
import { COMPLETIONIST_REQUIREMENTS } from "@/features/gamification/achievements";
import {
  applyGamificationEvent,
  applyGamificationEvents,
} from "@/features/gamification/engine";
import { createInitialGamificationState } from "@/features/gamification/types";

const STARTED_AT = 1_000;

describe("gamification engine", () => {
  it("awards Hello, World once for visiting the website", () => {
    const initial = createInitialGamificationState(STARTED_AT);
    const first = applyGamificationEvent(initial, {
      type: "site-visited",
      at: 2_000,
    });
    const repeated = applyGamificationEvent(first.state, {
      type: "site-visited",
      at: 3_000,
    });

    expect(first.state.achievements["hello-world"]?.unlockedAt).toBe(2_000);
    expect(first.effects).toEqual([
      {
        type: "achievement-earned",
        achievementId: "hello-world",
        occurredAt: 2_000,
      },
    ]);
    expect(repeated.state).toBe(first.state);
    expect(repeated.effects).toEqual([]);
  });

  it("awards Button Enthusiast on the fifth activation and never twice", () => {
    const initial = createInitialGamificationState(STARTED_AT);
    const activations = Array.from({ length: 7 }, (_, index) => ({
      type: "qualifying-activation" as const,
      at: 2_000 + index,
    }));
    const result = applyGamificationEvents(initial, activations);

    expect(result.state.counters.qualifyingActivations).toBe(5);
    expect(result.state.achievements["button-enthusiast"]).toBeDefined();
    expect(
      result.effects.filter(
        (effect) => effect.achievementId === "button-enthusiast",
      ),
    ).toHaveLength(1);
  });

  it("counts active time in chunks and caps progress after Touch Grass", () => {
    const initial = createInitialGamificationState(STARTED_AT);
    const result = applyGamificationEvents(initial, [
      { type: "active-time-elapsed", seconds: 12, at: 2_000 },
      { type: "active-time-elapsed", seconds: 18, at: 3_000 },
      { type: "active-time-elapsed", seconds: 20, at: 4_000 },
    ]);

    expect(result.state.counters.activeSeconds).toBe(30);
    expect(result.state.achievements["touch-grass"]).toBeDefined();
    expect(result.effects).toHaveLength(1);
  });

  it("awards Recruiter Any% when the resume is opened", () => {
    const initial = createInitialGamificationState(STARTED_AT);
    const routeVisit = applyGamificationEvent(initial, {
      type: "route-visited",
      route: "resume",
      at: 20_000,
    });
    const resumeOpened = applyGamificationEvent(routeVisit.state, {
      type: "resume-opened",
      at: 30_000,
    });

    expect(routeVisit.state.achievements["recruiter-any-percent"]).toBeUndefined();
    expect(routeVisit.state.routesVisited.resume).toBe(20_000);
    expect(
      resumeOpened.state.achievements["recruiter-any-percent"]?.unlockedAt,
    ).toBe(30_000);
  });

  it("awards the explicit download, contact, bug-report, and theme achievements", () => {
    const result = applyGamificationEvents(
      createInitialGamificationState(STARTED_AT),
      [
        { type: "resume-downloaded", at: 2_000 },
        { type: "contact-opened", at: 3_000 },
        { type: "bug-report-failed", at: 4_000 },
        { type: "theme-changed", at: 5_000 },
      ],
    );

    expect(result.state.achievements["offline-mode"]).toBeDefined();
    expect(result.state.achievements["open-channel"]).toBeDefined();
    expect(result.state.achievements["report-a-bug"]).toBeDefined();
    expect(result.state.achievements.chiaroscuro).toBeDefined();
  });

  it("adds Completionist when the final required achievement is earned", () => {
    const achievements = Object.fromEntries(
      COMPLETIONIST_REQUIREMENTS.filter(
        (achievementId) => achievementId !== "report-a-bug",
      ).map((achievementId) => [achievementId, { unlockedAt: 2_000 }]),
    );
    const nearlyComplete = {
      ...createInitialGamificationState(STARTED_AT),
      achievements,
    };
    const result = applyGamificationEvent(nearlyComplete, {
      type: "bug-report-failed",
      at: 3_000,
    });

    expect(result.state.achievements.completionist?.unlockedAt).toBe(3_000);
    expect(result.effects.map((effect) => effect.achievementId)).toEqual([
      "report-a-bug",
      "completionist",
    ]);
  });

  it("updates the sound preference without earning an achievement", () => {
    const initial = createInitialGamificationState(STARTED_AT);
    const result = applyGamificationEvent(initial, {
      type: "sound-preference-changed",
      enabled: true,
    });

    expect(result.state.preferences.soundEnabled).toBe(true);
    expect(result.effects).toEqual([]);
  });
});
