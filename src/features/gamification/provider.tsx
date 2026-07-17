"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { applyGamificationEvent } from "@/features/gamification/engine";
import {
  GAMIFICATION_STORAGE_KEY,
  loadGamificationState,
  parseGamificationState,
  removeGamificationState,
  saveGamificationState,
} from "@/features/gamification/persistence";
import {
  createInitialGamificationState,
  type GamificationEffect,
  type GamificationEvent,
  type GamificationState,
} from "@/features/gamification/types";

type QueuedEffect = GamificationEffect & { key: string };

type RuntimeState = {
  progress: GamificationState;
  effects: readonly QueuedEffect[];
  isReady: boolean;
};

type RuntimeAction =
  | { type: "hydrate"; progress: GamificationState }
  | { type: "event"; event: GamificationEvent }
  | { type: "dismiss-effect"; key: string }
  | { type: "reset"; now: number };

type GamificationContextValue = RuntimeState & {
  dispatchEvent: (event: GamificationEvent) => void;
  dismissEffect: (key: string) => void;
  resetProgress: () => void;
};

const GamificationContext = createContext<GamificationContextValue | null>(
  null,
);

function effectKey(effect: GamificationEffect, index: number): string {
  return `${effect.type}:${effect.achievementId}:${effect.occurredAt}:${index}`;
}

function runtimeReducer(
  runtime: RuntimeState,
  action: RuntimeAction,
): RuntimeState {
  switch (action.type) {
    case "hydrate":
      return {
        progress: action.progress,
        effects: [],
        isReady: true,
      };
    case "event": {
      if (!runtime.isReady) {
        return runtime;
      }

      const result = applyGamificationEvent(runtime.progress, action.event);
      if (result.state === runtime.progress && result.effects.length === 0) {
        return runtime;
      }

      return {
        ...runtime,
        progress: result.state,
        effects: [
          ...runtime.effects,
          ...result.effects.map((effect, index) => ({
            ...effect,
            key: effectKey(effect, index),
          })),
        ],
      };
    }
    case "dismiss-effect":
      return {
        ...runtime,
        effects: runtime.effects.filter((effect) => effect.key !== action.key),
      };
    case "reset":
      return {
        progress: createInitialGamificationState(action.now),
        effects: [],
        isReady: true,
      };
  }
}

export function GamificationProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const skipNextSave = useRef(false);
  const [runtime, dispatch] = useReducer(runtimeReducer, {
    progress: createInitialGamificationState(0),
    effects: [],
    isReady: false,
  });

  useEffect(() => {
    const now = Date.now();
    const storedProgress = loadGamificationState(window.localStorage, now);
    dispatch({
      type: "hydrate",
      progress: {
        ...storedProgress,
        session: { firstSeenAt: now },
      },
    });
  }, []);

  useEffect(() => {
    if (!runtime.isReady || runtime.progress.achievements["hello-world"]) {
      return;
    }

    dispatch({
      type: "event",
      event: { type: "site-visited", at: Date.now() },
    });
  }, [runtime.isReady, runtime.progress.achievements]);

  useEffect(() => {
    if (!runtime.isReady) {
      return;
    }

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    saveGamificationState(window.localStorage, runtime.progress);
  }, [runtime.isReady, runtime.progress]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== GAMIFICATION_STORAGE_KEY) {
        return;
      }

      // Storage events originate in another tab. Hydrate their state without
      // writing it back and creating an update loop between open tabs.
      skipNextSave.current = true;
      dispatch({
        type: "hydrate",
        progress: parseGamificationState(event.newValue, Date.now()),
      });
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const dispatchEvent = useCallback((event: GamificationEvent) => {
    dispatch({ type: "event", event });
  }, []);

  const dismissEffect = useCallback((key: string) => {
    dispatch({ type: "dismiss-effect", key });
  }, []);

  const resetProgress = useCallback(() => {
    removeGamificationState(window.localStorage);
    dispatch({ type: "reset", now: Date.now() });
  }, []);

  const value = useMemo<GamificationContextValue>(
    () => ({
      ...runtime,
      dispatchEvent,
      dismissEffect,
      resetProgress,
    }),
    [dismissEffect, dispatchEvent, resetProgress, runtime],
  );

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification(): GamificationContextValue {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }

  return context;
}
