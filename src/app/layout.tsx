import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { UmamiAnalytics } from "@/features/analytics/umami-analytics";
import "./globals.css";

const themeBootstrapScript = `
(function () {
  try {
    var theme = localStorage.getItem("michiel-portfolio:theme");
    if (theme !== "light" && theme !== "dark") {
      theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {}
})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ed" },
    { media: "(prefers-color-scheme: dark)", color: "#100e0b" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Michiel Van Eetvelde - Software engineer",
    template: "%s - Michiel Van Eetvelde",
  },
  description:
    "Software engineer with a front-end focus, building thoughtful web and mobile products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        {process.env.NODE_ENV === "production" ? <UmamiAnalytics /> : null}
      </body>
    </html>
  );
}
