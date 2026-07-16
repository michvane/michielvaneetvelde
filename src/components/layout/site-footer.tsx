import { Container } from "@/components/ui/container";
import { BugReportChallenge } from "@/features/gamification/components/bug-report-challenge";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border-strong py-7 text-text-muted print:hidden">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="meta-label">
          © {new Date().getFullYear()} Michiel Van Eetvelde
        </p>
        <div className="flex flex-col gap-1 sm:items-end">
          <p className="meta-label">Web, mobile, and playful things · Belgium</p>
          <BugReportChallenge />
        </div>
      </Container>
    </footer>
  );
}
