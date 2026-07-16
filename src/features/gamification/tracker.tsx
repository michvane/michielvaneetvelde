"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGamification } from "@/features/gamification/provider";
import type { TrackedRoute } from "@/features/gamification/types";

function trackedRoute(pathname: string): TrackedRoute | null {
  switch (pathname) {
    case "/":
      return "home";
    case "/resume":
      return "resume";
    case "/contact":
      return "contact";
    case "/play":
      return "play";
    default:
      return null;
  }
}

export function GamificationTracker() {
  const pathname = usePathname();
  const { dispatchEvent, isReady, progress } = useGamification();
  const touchGrassEarned = Boolean(progress.achievements["touch-grass"]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const route = trackedRoute(pathname);
    if (route) {
      dispatchEvent({ type: "route-visited", route, at: Date.now() });
    }
  }, [dispatchEvent, isReady, pathname]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    function handleActivation(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const control = target.closest<HTMLElement>(
        "[data-gamification-activation]",
      );
      if (
        !control ||
        control.getAttribute("aria-disabled") === "true" ||
        (control instanceof HTMLButtonElement && control.disabled)
      ) {
        return;
      }

      const at = Date.now();
      dispatchEvent({ type: "meaningful-interaction-completed", at });
      dispatchEvent({ type: "qualifying-activation", at });

      switch (control.dataset.gamificationEvent) {
        case "resume-opened":
          dispatchEvent({ type: "resume-opened", at });
          break;
        case "resume-downloaded":
          dispatchEvent({ type: "resume-downloaded", at });
          break;
        case "contact-opened":
          dispatchEvent({ type: "contact-opened", at });
          break;
      }
    }

    document.addEventListener("click", handleActivation);
    return () => document.removeEventListener("click", handleActivation);
  }, [dispatchEvent, isReady]);

  useEffect(() => {
    if (!isReady || touchGrassEarned) {
      return;
    }

    let interval: number | undefined;

    function stopTimer() {
      if (interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    }

    function startTimer() {
      if (document.visibilityState !== "visible" || interval !== undefined) {
        return;
      }

      interval = window.setInterval(() => {
        dispatchEvent({
          type: "active-time-elapsed",
          seconds: 1,
          at: Date.now(),
        });
      }, 1_000);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        startTimer();
      } else {
        stopTimer();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startTimer();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTimer();
    };
  }, [dispatchEvent, isReady, touchGrassEarned]);

  return null;
}
