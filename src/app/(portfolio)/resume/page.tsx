import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  education,
  employment,
  interests,
  resumeIntro,
  technologies,
} from "@/content/resume";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Michiel Van Eetvelde — software engineer with a front-end focus and 8+ years of experience building web and mobile applications.",
};

function SectionHeading({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="meta-label border-b-2 border-border-strong pb-3 text-text-muted">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent-ink print:hidden"
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
            Resume <span aria-hidden="true">✦</span>
          </p>
          <h1
            className="mt-5 text-balance text-[clamp(2.5rem,4.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.045em]"
            data-reveal="2"
          >
            Michiel Van Eetvelde
          </h1>
          <p className="meta-label mt-4 text-text-muted" data-reveal="2">
            Front-end engineer · Belgium
          </p>
          <p
            className="mt-7 max-w-xl text-base leading-7 text-text-muted"
            data-reveal="3"
          >
            {resumeIntro}
          </p>
          <div className="mt-8 print:hidden" data-reveal="3">
            <LinkButton
              href="/michiel_van_eetvelde_resume.pdf"
              download="Michiel_Van_Eetvelde_Resume.pdf"
              variant="secondary"
              data-gamification-event="resume-downloaded"
            >
              Download resume
              <span aria-hidden="true">↓</span>
            </LinkButton>
          </div>
        </header>

        <div
          className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.4fr)] lg:gap-20"
          data-reveal="3"
        >
          <div>
            <SectionHeading>Experience</SectionHeading>
            <div className="mt-8 space-y-12">
              {employment.map((entry) => (
                <article key={`${entry.company}-${entry.role}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-lg font-semibold tracking-[-0.025em]">
                      {entry.role} · {entry.company}
                    </h3>
                    <p className="meta-label text-text-muted">{entry.period}</p>
                  </div>
                  <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-text-muted marker:text-border-strong">
                    {entry.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-12">
            <section>
              <SectionHeading>Technologies I like</SectionHeading>
              <ul className="mt-6 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <li
                    key={technology}
                    className="rounded-control border border-border-strong px-2.5 py-1 font-mono text-xs"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionHeading>Education</SectionHeading>
              <ul className="mt-6 space-y-6">
                {education.map((entry) => (
                  <li key={entry.school}>
                    <p className="font-semibold tracking-[-0.025em]">
                      {entry.school}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      {entry.program}
                    </p>
                    <p className="meta-label mt-2 text-text-muted">
                      {entry.period}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionHeading>Interests</SectionHeading>
              <p className="mt-6 leading-7 text-text-muted">{interests}</p>
            </section>
          </aside>
        </div>
      </Container>
    </section>
  );
}
