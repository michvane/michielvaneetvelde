import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="flex flex-1 items-center py-14 sm:py-20">
        <Container>
          <p className="meta-label font-medium text-accent-ink">
            404 <span aria-hidden="true">✦</span>
          </p>
          <h1 className="mt-5 text-balance text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
            There&apos;s nothing at this address.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-text-muted">
            The page you&apos;re looking for doesn&apos;t exist - or
            doesn&apos;t exist yet. This portfolio is still growing.
          </p>
          <LinkButton href="/" variant="secondary" className="mt-9">
            Back to the homepage
          </LinkButton>
        </Container>
      </section>
    </SiteShell>
  );
}
