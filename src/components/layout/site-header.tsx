import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AchievementHud } from "@/features/gamification/components/achievement-hud";
import { ThemeToggle } from "@/features/theme/theme-toggle";

export function SiteHeader() {
  return (
    <header className="print:hidden">
      <Container className="grid min-h-20 grid-cols-[auto_1fr_auto] items-center gap-3 sm:min-h-24 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
        <AchievementHud />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-self-center text-sm font-semibold tracking-[-0.025em]"
          aria-label="Michiel Van Eetvelde, home"
          data-gamification-activation
        >
          Michiel Van Eetvelde
        </Link>
        <ThemeToggle />
      </Container>
    </header>
  );
}
