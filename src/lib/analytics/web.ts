const GA_MEASUREMENT_ID = "G-NGV5NZ8WLY";
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
const AMPLITUDE_API_KEY = "1286cf365cfb1fe70cd1c3a7fcf5aeae";
const AMPLITUDE_SCRIPT_SRC = "https://cdn.amplitude.com/script/1286cf365cfb1fe70cd1c3a7fcf5aeae.js";

declare global {
  interface AmplitudeGlobal {
    add: (plugin: unknown) => void;
    init: (apiKey: string, options: Record<string, unknown>) => void;
  }

  interface SessionReplayGlobal {
    plugin: (options: { sampleRate: number }) => unknown;
  }

  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    amplitude?: AmplitudeGlobal;
    sessionReplay?: SessionReplayGlobal;
  }
}

let analyticsInitialized = false;
let amplitudePrepared = false;
let amplitudeInitialized = false;

function getOrCreateScriptTag(id: string, src: string): HTMLScriptElement {
  const existing = document.getElementById(id);
  if (existing instanceof HTMLScriptElement) return existing;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
  return script;
}

function initializeGoogleAnalytics() {
  // Equivalent to the standard gtag bootstrap snippet.
  getOrCreateScriptTag("ga-gtag", GA_SCRIPT_SRC);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
}

function initializeAmplitude() {
  if (amplitudeInitialized || !window.amplitude?.init) return;

  if (window.sessionReplay?.plugin && window.amplitude.add) {
    window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
  }

  window.amplitude.init(AMPLITUDE_API_KEY, {
    fetchRemoteConfig: true,
    autocapture: true,
  });
  amplitudeInitialized = true;
}

export function prepareAmplitudeTag() {
  if (amplitudePrepared || typeof window === "undefined") return;
  amplitudePrepared = true;

  const script = getOrCreateScriptTag("amplitude-sdk", AMPLITUDE_SCRIPT_SRC);

  if (window.amplitude?.init) {
    initializeAmplitude();
    return;
  }

  script.addEventListener("load", initializeAmplitude, { once: true });
}

export function initializeWebAnalytics() {
  if (analyticsInitialized || typeof window === "undefined") return;
  analyticsInitialized = true;

  initializeGoogleAnalytics();
  prepareAmplitudeTag();
}

