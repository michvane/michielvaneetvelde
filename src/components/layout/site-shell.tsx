import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { GamificationExperience } from "@/features/gamification/gamification-experience";

export function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GamificationExperience>
      <div className="flex min-h-svh flex-col">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-control bg-text px-4 py-2 text-sm font-medium text-canvas transition-transform focus:translate-y-0 print:hidden"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
      </div>
    </GamificationExperience>
  );
}
