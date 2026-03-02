import { useCallback, useRef } from "react";

export function useChime() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = useCallback(() => {
    try {
      const ctx = audioContextRef.current || new AudioContext();
      audioContextRef.current = ctx;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.3);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.3 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.3);
        osc.stop(now + i * 0.3 + 1.5);
      });
    } catch (e) {
      console.log("Audio not available");
    }
  }, []);

  return playChime;
}
