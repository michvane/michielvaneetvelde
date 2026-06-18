import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play",
  robots: { index: false, follow: false },
};

export default function PlayPage() {
  return (
    <main className="fixed inset-0 bg-black">
      <iframe
        src="/game/index.html"
        title="Game"
        className="h-full w-full border-0"
        allow="autoplay; fullscreen; gamepad"
      />
    </main>
  );
}
