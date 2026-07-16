import {
  BUTTON_ENTHUSIAST_THRESHOLD,
  COMPLETIONIST_REQUIREMENTS,
  TOUCH_GRASS_SECONDS,
} from "@/features/gamification/achievements";
import type {
  AchievementId,
  EngineResult,
  GamificationEvent,
  GamificationState,
} from "@/features/gamification/types";

function unchanged(state: GamificationState): EngineResult {
  return { state, effects: [] };
}

function earnAchievement(
  state: GamificationState,
  achievementId: AchievementId,
  at: number,
): EngineResult {
  if (state.achievements[achievementId]) {
    return unchanged(state);
  }

  return {
    state: {
      ...state,
      achievements: {
        ...state.achievements,
        [achievementId]: { unlockedAt: at },
      },
    },
    effects: [
      {
        type: "achievement-earned",
        achievementId,
        occurredAt: at,
      },
    ],
  };
}

function includeCompletionist(result: EngineResult, at: number): EngineResult {
  const hasCompletedEverything = COMPLETIONIST_REQUIREMENTS.every(
    (achievementId) => result.state.achievements[achievementId],
  );
  if (!hasCompletedEverything) {
    return result;
  }

  const completionist = earnAchievement(result.state, "completionist", at);
  return {
    state: completionist.state,
    effects: [...result.effects, ...completionist.effects],
  };
}

function mergeResults(
  initialState: GamificationState,
  ...steps: ReadonlyArray<(state: GamificationState) => EngineResult>
): EngineResult {
  return steps.reduce<EngineResult>(
    (result, step) => {
      const next = step(result.state);
      return {
        state: next.state,
        effects: [...result.effects, ...next.effects],
      };
    },
    { state: initialState, effects: [] },
  );
}

function recordMeaningfulInteraction(
  state: GamificationState,
  at: number,
): EngineResult {
  if (state.flags.meaningfulInteractionCompleted) {
    return unchanged(state);
  }

  const nextState: GamificationState = {
    ...state,
    flags: {
      ...state.flags,
      meaningfulInteractionCompleted: true,
    },
  };

  return earnAchievement(nextState, "hello-world", at);
}

function recordQualifyingActivation(
  state: GamificationState,
  at: number,
): EngineResult {
  const qualifyingActivations = Math.min(
    BUTTON_ENTHUSIAST_THRESHOLD,
    state.counters.qualifyingActivations + 1,
  );
  const nextState: GamificationState = {
    ...state,
    counters: {
      ...state.counters,
      qualifyingActivations,
    },
  };

  if (qualifyingActivations < BUTTON_ENTHUSIAST_THRESHOLD) {
    return { state: nextState, effects: [] };
  }

  return earnAchievement(nextState, "button-enthusiast", at);
}

function recordActiveTime(
  state: GamificationState,
  seconds: number,
  at: number,
): EngineResult {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return unchanged(state);
  }

  const activeSeconds = Math.min(
    TOUCH_GRASS_SECONDS,
    state.counters.activeSeconds + seconds,
  );
  const nextState: GamificationState = {
    ...state,
    counters: {
      ...state.counters,
      activeSeconds,
    },
  };

  if (activeSeconds < TOUCH_GRASS_SECONDS) {
    return { state: nextState, effects: [] };
  }

  return earnAchievement(nextState, "touch-grass", at);
}

function recordRouteVisit(
  state: GamificationState,
  route: GamificationEvent & { type: "route-visited" },
): EngineResult {
  if (state.routesVisited[route.route]) {
    return unchanged(state);
  }

  return {
    state: {
      ...state,
      routesVisited: {
        ...state.routesVisited,
        [route.route]: route.at,
      },
    },
    effects: [],
  };
}

export function applyGamificationEvent(
  state: GamificationState,
  event: GamificationEvent,
): EngineResult {
  if (event.type === "sound-preference-changed") {
    return {
      state: {
        ...state,
        preferences: {
          ...state.preferences,
          soundEnabled: event.enabled,
        },
      },
      effects: [],
    };
  }

  let result: EngineResult;
  switch (event.type) {
    case "meaningful-interaction-completed":
      result = recordMeaningfulInteraction(state, event.at);
      break;
    case "qualifying-activation":
      result = recordQualifyingActivation(state, event.at);
      break;
    case "active-time-elapsed":
      result = recordActiveTime(state, event.seconds, event.at);
      break;
    case "route-visited":
      result = recordRouteVisit(state, event);
      break;
    case "resume-opened":
      result = earnAchievement(state, "recruiter-any-percent", event.at);
      break;
    case "resume-downloaded":
      result = earnAchievement(state, "offline-mode", event.at);
      break;
    case "contact-opened":
      result = earnAchievement(state, "open-channel", event.at);
      break;
    case "bug-report-failed":
      result = earnAchievement(state, "report-a-bug", event.at);
      break;
    case "theme-changed":
      result = earnAchievement(state, "chiaroscuro", event.at);
      break;
  }

  return includeCompletionist(result, event.at);
}

export function applyGamificationEvents(
  state: GamificationState,
  events: readonly GamificationEvent[],
): EngineResult {
  return mergeResults(
    state,
    ...events.map(
      (event) => (currentState: GamificationState) =>
        applyGamificationEvent(currentState, event),
    ),
  );
}
