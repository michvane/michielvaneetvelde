import type { AchievementId } from "@/features/gamification/types";

export type AchievementDefinition = {
  title: string;
  description: string;
  hint: string;
};

export const BUTTON_ENTHUSIAST_THRESHOLD = 5;
export const TOUCH_GRASS_SECONDS = 30;

export const COMPLETIONIST_REQUIREMENTS = [
  "hello-world",
  "button-enthusiast",
  "touch-grass",
  "recruiter-any-percent",
  "offline-mode",
  "open-channel",
  "report-a-bug",
  "chiaroscuro",
] as const satisfies readonly AchievementId[];

export const achievementDefinitions = {
  "hello-world": {
    title: "Hello, World",
    description: "The portfolio loaded. You’re already making progress.",
    hint: "Visit the website",
  },
  "button-enthusiast": {
    title: "Button Enthusiast",
    description: `${BUTTON_ENTHUSIAST_THRESHOLD} activations. Thorough testing, obviously.`,
    hint: "Some buttons deserve a second click",
  },
  "touch-grass": {
    title: "Touch Grass",
    description: `Stayed for ${TOUCH_GRASS_SECONDS} active seconds. Close enough.`,
    hint: "Stick around for a moment",
  },
  "recruiter-any-percent": {
    title: "Recruiter Any%",
    description: "Went straight for the experience section.",
    hint: "Open the resume",
  },
  "offline-mode": {
    title: "Offline Mode",
    description: "Downloaded the resume for the road.",
    hint: "Some things are worth keeping",
  },
  "open-channel": {
    title: "Open Channel",
    description: "Found the direct line.",
    hint: "Make contact",
  },
  "report-a-bug": {
    title: "Report a Bug",
    description: "Attempted the impossible. The bug escaped.",
    hint: "There must be a bug around here somewhere",
  },
  chiaroscuro: {
    title: "Chiaroscuro",
    description: "Tried the other side of the palette.",
    hint: "Change the theme",
  },
  completionist: {
    title: "Completionist",
    description: "Left no suspicious corner unexplored.",
    hint: "Complete every other achievement",
  },
} satisfies Record<AchievementId, AchievementDefinition>;
