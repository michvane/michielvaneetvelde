import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Software engineer",
};

const cellClasses =
  "flex min-h-36 flex-col justify-between gap-6 border-b-2 border-r-2 border-border-strong p-5 sm:min-h-40 sm:p-6";

const linkCellClasses = `${cellClasses} group transition-colors duration-200 hover:bg-surface`;

const valueClasses = "text-lg font-semibold leading-tight tracking-[-0.025em]";

function LinkCellBody({
  label,
  value,
  external = false,
}: Readonly<{ label: string; value: string; external?: boolean }>) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="meta-label text-text-muted">{label}</p>
        <span
          aria-hidden="true"
          className="text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-ink"
        >
          {external ? "↗" : "→"}
        </span>
      </div>
      <p className={valueClasses}>{value}</p>
    </>
  );
}

export default function HomePage() {
  return (
    <section className="flex flex-1 items-center py-14 sm:py-20">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)] lg:gap-28">
          <div className="max-w-2xl">
            <p className="meta-label font-medium text-accent-ink" data-reveal>
              Hello, I&apos;m Michiel <span aria-hidden="true">✦</span>
            </p>
            <h1
              className="mt-5 text-balance text-[clamp(1.8125rem,calc(1.143rem+3.35vw),3.5rem)] font-semibold leading-[1.02] tracking-[-0.05em]"
              data-reveal="2"
            >
              <span className="block whitespace-nowrap">
                Software engineer,{" "}
              </span>
              <span className="block whitespace-nowrap">
                with a front-end focus.
              </span>
            </h1>
            <p
              className="mt-7 max-w-lg text-base leading-7 text-text-muted sm:text-lg sm:leading-8"
              data-reveal="3"
            >
              I build reliable web and mobile products, combining thoughtful
              interfaces with the engineering and product judgment needed to
              make them work in the real world.
            </p>
          </div>

          <div data-reveal="3">
            <p className="meta-label mb-4 text-text-muted">At a glance</p>
            <div className="grid grid-cols-2 border-l-2 border-t-2 border-border-strong">
              <div className={cellClasses}>
                <p className="meta-label text-text-muted">Experience</p>
                <p className={valueClasses}>8+ years</p>
              </div>
              <div className={cellClasses}>
                <p className="meta-label text-text-muted">Stack</p>
                <p className={valueClasses}>React & React Native</p>
              </div>
              <Link href="/resume" className={linkCellClasses}>
                <LinkCellBody label="Resume" value="See experience" />
              </Link>
              <a
                href="https://www.linkedin.com/in/michiel-van-eetvelde-03649b163/"
                className={linkCellClasses}
              >
                <LinkCellBody label="Contact" value="LinkedIn" external />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
