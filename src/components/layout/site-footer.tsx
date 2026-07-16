import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="meta-label border-t-2 border-border-strong py-7 text-text-muted print:hidden">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Michiel Van Eetvelde</p>
        <p>Web, mobile, and playful things · Belgium</p>
      </Container>
    </footer>
  );
}
