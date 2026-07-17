import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { contactChannels, contactLocation } from "@/content/contact";
import { PrivacyMap } from "@/features/privacy-map/privacy-map";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to reach Michiel Van Eetvelde - email, LinkedIn, and GitHub, plus a deliberately approximate map of the Ghent area.",
};

export default function ContactPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent-ink"
          data-reveal
          data-gamification-activation
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            ←
          </span>
          Back to home
        </Link>

        <header className="mt-8 max-w-2xl">
          <p className="meta-label font-medium text-accent-ink" data-reveal>
            Contact <span aria-hidden="true">✦</span>
          </p>
          <h1
            className="mt-5 text-balance text-[clamp(2.5rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em]"
            data-reveal="2"
          >
            Get in touch!
          </h1>
        </header>

        <div className="mt-16" data-reveal="3">
          <h2 className="meta-label border-b-2 border-border-strong pb-3 text-text-muted">
            Channels
          </h2>
          <ul className="mt-8 grid border-l-2 border-t-2 border-border-strong sm:grid-cols-3">
            {contactChannels.map((channel) => (
              <li key={channel.label} className="grid min-w-0">
                <a
                  href={channel.href}
                  className="group flex min-h-36 min-w-0 flex-col justify-between gap-6 border-b-2 border-r-2 border-border-strong p-5 transition-colors duration-200 hover:bg-surface sm:min-h-40 sm:p-6"
                  {...(channel.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  data-gamification-activation
                  data-gamification-event="contact-opened"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="meta-label text-text-muted">
                      {channel.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-ink"
                    >
                      {channel.external ? "↗" : "→"}
                    </span>
                  </span>
                  <span className="break-words text-lg font-semibold leading-tight tracking-[-0.025em]">
                    {channel.value}
                    {channel.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16" data-reveal="3">
          <h2 className="meta-label border-b-2 border-border-strong pb-3 text-text-muted">
            Location
          </h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(15rem,0.5fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-lg font-semibold tracking-[-0.025em]">
                {contactLocation.region}
              </p>
              <p className="meta-label mt-3 text-text-muted">
                {contactLocation.timezone}
              </p>
              <p className="mt-6 max-w-md text-sm leading-6 text-text-muted">
                {contactLocation.privacyNote}
              </p>
            </div>
            <PrivacyMap />
          </div>
        </div>
      </Container>
    </section>
  );
}
