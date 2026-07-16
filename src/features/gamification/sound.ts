let audioContext: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) {
    return null;
  }

  try {
    audioContext ??= new AudioContext();
  } catch {
    return null;
  }
  return audioContext;
}

export function playAchievementChime(): void {
  const audio = context();
  if (!audio) {
    return;
  }

  void audio
    .resume()
    .then(() => {
      const startedAt = audio.currentTime;
      const gain = audio.createGain();
      gain.gain.setValueAtTime(0.0001, startedAt);
      gain.gain.exponentialRampToValueAtTime(0.055, startedAt + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startedAt + 0.42);
      gain.connect(audio.destination);

      [523.25, 659.25].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startedAt);
        oscillator.connect(gain);
        oscillator.start(startedAt + index * 0.075);
        oscillator.stop(startedAt + 0.44);
      });
    })
    .catch(() => {
      // Audio can be blocked by browser or device policy; visuals still carry
      // the complete achievement feedback.
    });
}
