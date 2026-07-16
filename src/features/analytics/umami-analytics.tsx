"use client";

import Script from "next/script";
import { flushAnalyticsQueue } from "@/features/analytics/analytics";

const UMAMI_WEBSITE_ID = "bdbd0b9f-8bf0-4bfe-9914-3ba345885c60";

export function UmamiAnalytics() {
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
      onReady={flushAnalyticsQueue}
    />
  );
}
