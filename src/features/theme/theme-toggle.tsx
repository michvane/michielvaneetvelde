"use client";

import { useSyncExternalStore } from "react";
import { useGamification } from "@/features/gamification/provider";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "michiel-portfolio:theme";
const THEME_CHANGE_EVENT = "portfolio-theme-change";

function currentTheme(): Theme {
  const explicitTheme = document.documentElement.dataset.theme;
  if (explicitTheme === "light" || explicitTheme === "dark") {
    return explicitTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

export function ThemeToggle() {
  const { dispatchEvent } = useGamification();
  const theme = useSyncExternalStore(subscribeToTheme, currentTheme, () => null);

  function toggleTheme() {
    const nextTheme = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies for this page when storage is blocked.
    }

    dispatchEvent({ type: "theme-changed", at: Date.now() });
  }

  const destination = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="group inline-flex h-11 w-11 items-center justify-center justify-self-end border border-border-strong text-text-muted transition-colors hover:bg-surface hover:text-text"
      aria-label={theme ? `Switch to ${destination} theme` : "Toggle color theme"}
      title={theme ? `Switch to ${destination} theme` : "Toggle color theme"}
      data-gamification-activation
      onClick={toggleTheme}
    >
      <span
        aria-hidden="true"
        className={`relative block h-4 w-4 rounded-full border border-current transition-transform duration-300 group-hover:rotate-45 ${
          theme === "light" ? "rotate-180" : "rotate-0"
        }`}
      >
        <span className="absolute inset-y-[-1px] right-[-1px] w-1/2 rounded-r-full bg-current" />
      </span>
    </button>
  );
}
