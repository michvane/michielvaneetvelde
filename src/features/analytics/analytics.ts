export type AnalyticsEventName =
  | "achievement_unlocked"
  | "resume_downloaded";

export type AnalyticsProperties = Record<
  string,
  boolean | number | string
>;

type QueuedAnalyticsEvent = {
  name: AnalyticsEventName;
  properties?: AnalyticsProperties;
};

const MAX_QUEUED_EVENTS = 50;
let queuedEvents: QueuedAnalyticsEvent[] = [];

declare global {
  interface Window {
    umami?: {
      track: (name: string, properties?: AnalyticsProperties) => void;
    };
  }
}

export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  properties?: AnalyticsProperties,
) {
  if (process.env.NODE_ENV !== "production" || typeof window === "undefined") {
    return;
  }

  if (window.umami) {
    window.umami.track(name, properties);
    return;
  }

  if (queuedEvents.length < MAX_QUEUED_EVENTS) {
    queuedEvents.push({ name, properties });
  }
}

export function flushAnalyticsQueue() {
  if (typeof window === "undefined" || !window.umami) {
    return;
  }

  const events = queuedEvents;
  queuedEvents = [];
  for (const event of events) {
    window.umami.track(event.name, event.properties);
  }
}
