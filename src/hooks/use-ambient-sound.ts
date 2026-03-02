import { useState, useEffect, useCallback, useRef } from "react";

type SoundType = "rain" | "lofi" | "forest";

export function useAmbientSound() {
  const [playing, setPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>("rain");
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ source: AudioBufferSourceNode | OscillatorNode; gain: GainNode }[]>([]);

  const stop = useCallback(() => {
    nodesRef.current.forEach(({ source, gain }) => {
      try {
        gain.gain.linearRampToValueAtTime(0, (audioContextRef.current?.currentTime || 0) + 0.5);
        setTimeout(() => source.stop(), 600);
      } catch {}
    });
    nodesRef.current = [];
    setPlaying(false);
  }, []);

  const createNoise = useCallback((ctx: AudioContext, length: number) => {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }, []);

  const play = useCallback((type: SoundType) => {
    stop();
    const ctx = audioContextRef.current || new AudioContext();
    audioContextRef.current = ctx;

    if (type === "rain") {
      const noise = ctx.createBufferSource();
      noise.buffer = createNoise(ctx, 4);
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.value = volume * 0.6;
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
      nodesRef.current.push({ source: noise, gain });

      // Higher frequency layer
      const noise2 = ctx.createBufferSource();
      noise2.buffer = createNoise(ctx, 4);
      noise2.loop = true;
      const filter2 = ctx.createBiquadFilter();
      filter2.type = "highpass";
      filter2.frequency.value = 4000;
      const gain2 = ctx.createGain();
      gain2.gain.value = volume * 0.15;
      noise2.connect(filter2).connect(gain2).connect(ctx.destination);
      noise2.start();
      nodesRef.current.push({ source: noise2, gain: gain2 });
    } else if (type === "lofi") {
      // Warm drone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 220;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      const gain = ctx.createGain();
      gain.gain.value = volume * 0.12;
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start();
      nodesRef.current.push({ source: osc, gain });

      // Soft noise crackle
      const noise = ctx.createBufferSource();
      noise.buffer = createNoise(ctx, 4);
      noise.loop = true;
      const nFilter = ctx.createBiquadFilter();
      nFilter.type = "bandpass";
      nFilter.frequency.value = 2000;
      nFilter.Q.value = 2;
      const nGain = ctx.createGain();
      nGain.gain.value = volume * 0.05;
      noise.connect(nFilter).connect(nGain).connect(ctx.destination);
      noise.start();
      nodesRef.current.push({ source: noise, gain: nGain });
    } else if (type === "forest") {
      const noise = ctx.createBufferSource();
      noise.buffer = createNoise(ctx, 4);
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 400;
      filter.Q.value = 0.3;
      const gain = ctx.createGain();
      gain.gain.value = volume * 0.35;
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
      nodesRef.current.push({ source: noise, gain });

      // High wind
      const wind = ctx.createBufferSource();
      wind.buffer = createNoise(ctx, 4);
      wind.loop = true;
      const wFilter = ctx.createBiquadFilter();
      wFilter.type = "bandpass";
      wFilter.frequency.value = 2500;
      wFilter.Q.value = 1;
      const wGain = ctx.createGain();
      wGain.gain.value = volume * 0.08;
      wind.connect(wFilter).connect(wGain).connect(ctx.destination);
      wind.start();
      nodesRef.current.push({ source: wind, gain: wGain });
    }

    setSoundType(type);
    setPlaying(true);
  }, [stop, createNoise, volume]);

  // Update volume on playing nodes
  useEffect(() => {
    nodesRef.current.forEach(({ gain }) => {
      if (gain.gain.value > 0) {
        gain.gain.linearRampToValueAtTime(
          volume * (gain.gain.value / (volume || 0.3)),
          (audioContextRef.current?.currentTime || 0) + 0.1
        );
      }
    });
  }, [volume]);

  // Cleanup
  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  return { playing, soundType, volume, play, stop, setVolume, setSoundType };
}
