const GA_MEASUREMENT_ID = "G-NGV5NZ8WLY";
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
const AMPLITUDE_API_KEY = "631fe8d9fa9f774cd421f8cb364771f6";
const AMPLITUDE_SCRIPT_SRC = `https://cdn.amplitude.com/script/${AMPLITUDE_API_KEY}.js`;
const META_PIXEL_ID = "911632511796528";
const META_PIXEL_SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";

type EventProperties = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface AmplitudeGlobal {
    add: (plugin: unknown) => void;
    init: (apiKey: string, options: Record<string, unknown>) => void;
    track?: (eventName: string, eventProperties?: Record<string, unknown>) => void;
  }

  interface SessionReplayGlobal {
    plugin: (options: { sampleRate: number }) => unknown;
  }

  interface MetaPixelQueueFunction {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[][];
    loaded?: boolean;
    version?: string;
    push?: (...args: unknown[]) => void;
  }

  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    amplitude?: AmplitudeGlobal;
    sessionReplay?: SessionReplayGlobal;
    fbq?: MetaPixelQueueFunction;
    _fbq?: MetaPixelQueueFunction;
  }
}

let analyticsInitialized = false;
let amplitudePrepared = false;
let amplitudeInitialized = false;
let metaPixelPrepared = false;
let metaPixelInitialized = false;

function normalizeProperties(properties: EventProperties = {}) {
  const normalized: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value !== undefined) {
      normalized[key] = value;
    }
  }
  return normalized;
}

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
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
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

function ensureMetaPixelQueueFunction() {
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue.push(args);
  } as MetaPixelQueueFunction;

  if (!window._fbq) {
    window._fbq = fbq;
  }

  fbq.queue = [];
  fbq.push = (...args: unknown[]) => fbq(...args);
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
}

export function prepareMetaPixelTag() {
  if (metaPixelPrepared || typeof window === "undefined") return;
  metaPixelPrepared = true;

  ensureMetaPixelQueueFunction();
  getOrCreateScriptTag("meta-pixel-sdk", META_PIXEL_SCRIPT_SRC);

  if (!metaPixelInitialized && window.fbq) {
    window.fbq("init", META_PIXEL_ID);
    metaPixelInitialized = true;
  }
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
  prepareMetaPixelTag();
}

export function trackEvent(eventName: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;
  const eventProperties = normalizeProperties(properties);

  if (window.gtag) {
    window.gtag("event", eventName, eventProperties);
  }

  if (window.amplitude?.track) {
    window.amplitude.track(eventName, eventProperties);
  }
}

export function trackPageView(pagePath: string, prefix?: string) {
  const eventName = prefix ? `${prefix}_page_view` : "page_view";
  trackEvent(eventName, { page_path: pagePath });

  if (window.fbq && metaPixelInitialized) {
    window.fbq("track", "PageView");
  }
}

// ── Ink analytics (ink_ prefix) ──────────────────────────────

export function trackStartJourney(journeyName: string) {
  trackEvent("ink_Start_journey", { journey_name: journeyName });
}

export function trackCompleteJourney(journeyName: string) {
  trackEvent("ink_Complete_journey", { journey_name: journeyName });
}

export function trackUploadPhoto() {
  trackEvent("ink_Upload_photo");
}

export function trackMoodCheckin(emotion: string) {
  trackEvent("ink_Mood_checkin", { emotion });
}

export function trackNewEntry() {
  trackEvent("ink_New_entry");

  if (window.fbq && metaPixelInitialized) {
    window.fbq("track", "CompleteRegistration");
  }
}

// ── 4 Aces analytics (4a_ prefix) ───────────────────────────

export function track4AIntakeStarted() {
  trackEvent("4a_intake_started");

  if (window.fbq && metaPixelInitialized) {
    window.fbq("track", "CompleteRegistration");
  }
}

export function track4AIntakeStep(
  stepNumber: number,
  stepName: string,
  stepQuestion: string,
  userAnswer: string | number | boolean,
) {
  trackEvent("4a_intake_step", {
    step_number: stepNumber,
    step_name: stepName,
    step_question: stepQuestion,
    user_answer: String(userAnswer),
  });
}

export function track4AIntakeCompleted(recommendedMethods: string[]) {
  trackEvent("4a_intake_completed", {
    recommended_methods: recommendedMethods.join(", "),
  });
}

export function track4AMethodStarted(methodName: string) {
  trackEvent("4a_method_started", { method_name: methodName });
}

export function track4AMethodResultRevealed(methodName: string) {
  trackEvent("4a_method_result_revealed", { method_name: methodName });

  if (window.fbq && metaPixelInitialized) {
    window.fbq("track", "AddToCart");
  }
}

export function track4AMethodCompleted(methodName: string) {
  trackEvent("4a_method_completed", { method_name: methodName });
}

export function track4AOptionSaved(optionText: string) {
  trackEvent("4a_option_saved", { option_text: optionText });
}

export function track4ASeeMoreMethodsClicked() {
  trackEvent("4a_see_more_methods_clicked");
}

export function track4AClarityRatingSubmitted(clarityRating: number, methodName?: string) {
  trackEvent("4a_clarity_rating_submitted", { clarity_rating: clarityRating, method_name: methodName });
}

export function track4AWantMoreClarityClicked(methodName: string) {
  trackEvent("4a_want_more_clarity_clicked", { method_name: methodName });
}

export function track4AClarityQuestionsCompleted(
  methodName: string,
  options: string[],
  clarityAnswers: Record<number, { gain: number; cost: number; selfRespect: number }>,
) {
  const params: EventProperties = {
    method_name: methodName,
    options_count: options.length,
  };
  options.forEach((option, i) => {
    const answer = clarityAnswers[i];
    if (answer) {
      params[`option_${i + 1}_name`] = option;
      params[`option_${i + 1}_gain`] = answer.gain;
      params[`option_${i + 1}_cost`] = answer.cost;
      params[`option_${i + 1}_self_respect`] = answer.selfRespect;
    }
  });
  trackEvent("4a_clarity_questions_completed", params);
}
