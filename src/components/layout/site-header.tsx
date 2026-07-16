import Link from "next/link";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  return (
    <header className="print:hidden">
      <Container className="flex min-h-20 items-center sm:min-h-24">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-semibold tracking-[-0.025em]"
          aria-label="Michiel Van Eetvelde, home"
        >
          Michiel Van Eetvelde
        </Link>
      </Container>
    </header>
  );
}
