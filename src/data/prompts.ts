export const dailyPrompts = [
  "What would you tell your younger self about this exact moment in your life?",
  "Describe the last time you felt truly at peace. What surrounded you?",
  "Write about a door that closed — and the window it opened.",
  "If your anxiety could speak, what would it say? What would you say back?",
  "What are three things you're carrying today that aren't yours to hold?",
  "Describe the texture of your current mood — is it rough, smooth, tangled?",
  "What small, unremarkable moment from yesterday deserves to be remembered?",
  "Write a letter to the person you'll be six months from now.",
  "What truth have you been tiptoeing around?",
  "If today were a chapter in your memoir, what would you title it?",
  "What does your body know that your mind refuses to accept?",
  "Describe the silence between your thoughts right now.",
  "What old story about yourself are you ready to rewrite?",
  "Write about something you've outgrown but haven't let go of yet.",
  "What would radical honesty look like in your life today?",
  "Describe the view from your favorite window — real or imagined.",
  "What conversation do you keep replaying? Rewrite the ending.",
  "If you could distill this week into a single word, what would it be?",
  "What are you pretending not to know?",
  "Write about the last thing that made you laugh until you cried.",
  "What would you do today if you knew it couldn't fail?",
  "Describe the weight of a thought you haven't spoken aloud.",
  "What small act of courage did today require?",
  "Write about a place that shaped you — not the events, just the feeling.",
  "What would your life look like if you stopped apologizing for taking up space?",
  "Describe the color of your gratitude today.",
  "What boundary have you been afraid to draw?",
  "Write about the last time you surprised yourself.",
  "What are you mourning that no one knows about?",
  "If your intuition had a voice, what is it whispering right now?",
  // 31–60
  "What does freedom feel like in your body?",
  "Write about a meal that changed something in you.",
  "What would you create if no one would ever see it?",
  "Describe a sound from your childhood that still lives inside you.",
  "What are you holding onto that's holding you back?",
  "Write about a stranger who left a mark on your day.",
  "What does your perfect morning look like — in vivid detail?",
  "If your home could talk, what story would it tell about you?",
  "What part of yourself have you been neglecting?",
  "Write about a promise you made to yourself. Did you keep it?",
  "What would you do with an entire day of solitude?",
  "Describe the space between who you are and who you want to be.",
  "What does rest really look like for you — not productivity disguised as rest?",
  "Write about a time you chose yourself over someone else's expectations.",
  "What question are you afraid to ask — and of whom?",
  "Describe the feeling of walking into a place you love.",
  "What is the kindest thing you could say to yourself right now?",
  "Write about a habit you want to release. What does it protect you from?",
  "What does your loneliness look like when you sit with it?",
  "If you could send one sentence to everyone you've ever loved, what would it say?",
  "What does your creativity need from you today?",
  "Write about a fear that turned out to be a teacher.",
  "What are you building — slowly, quietly, in the background of your life?",
  "Describe the taste of a memory you return to often.",
  "What would your life look like if you trusted the timing?",
  "Write about something beautiful you noticed today that most people missed.",
  "What does your anger need you to understand?",
  "If you could inhabit someone else's perspective for a day, whose would it be?",
  "What are the unwritten rules you live by? Which ones no longer serve you?",
  "Write about the last time you felt genuinely proud of yourself.",
  // 61–90
  "What is the softest thing about you?",
  "Describe a relationship that taught you more about yourself than about the other person.",
  "What would you say to the version of you that existed a year ago?",
  "Write about a season of your life that felt like winter — and how spring eventually came.",
  "What do your hands know how to do that brings you joy?",
  "If you could preserve one ordinary day in amber, which would it be?",
  "What are you resisting that might actually be exactly what you need?",
  "Write about a piece of art — a song, a painting, a poem — that cracked you open.",
  "What patterns do you notice repeating in your relationships?",
  "Describe the landscape of your inner world right now. Is it stormy? Still? Shifting?",
  "What conversation with yourself is long overdue?",
  "Write about a goodbye that shaped how you show up in the world.",
  "What does gentleness look like when directed at yourself?",
  "If your life were a garden, what would you plant more of? What would you uproot?",
  "What is one thing you've never written down before? Write it now.",
  "Describe the quality of light in your happiest memory.",
  "What do you need permission to feel today?",
  "Write about a choice you made that nobody understood — but you knew was right.",
  "What would you do differently if you stopped keeping score?",
  "If you could reclaim one hour from this week, how would you spend it?",
  "What is the most honest thing you can write right now, without editing?",
  "Describe a moment when you felt completely seen by another person.",
  "What are you learning to forgive — in yourself or someone else?",
  "Write about the version of yourself that exists when no one is watching.",
  "What does your sadness need from you that you haven't offered yet?",
  "If you could bottle a feeling, which one would you keep on your shelf?",
  "What invisible labor do you carry that deserves to be named?",
  "Write about a bridge you burned. Would you rebuild it?",
  "What is your body asking for that you keep postponing?",
  "Describe the difference between who you show the world and who you are in private.",
  // 91–105
  "What is the bravest thought you've had this week?",
  "Write about a risk that paid off in ways you didn't expect.",
  "What would you stop doing immediately if you realized no one was judging you?",
  "Describe the rhythm of your life right now — is it a waltz, a sprint, a meandering trail?",
  "What would your younger self think of the life you're building?",
  "Write about a comfort that has become a cage.",
  "What are the small rituals that keep you tethered to yourself?",
  "If today were your last day of ordinary life, what would you want to notice?",
  "What is the most important thing you've unlearned?",
  "Write about a moment of unexpected tenderness — given or received.",
  "What does your future self need you to start doing today?",
  "Describe an emotion you felt today that you don't have a word for.",
  "What are you grateful for that you used to take for granted?",
  "Write about the space you need but rarely give yourself.",
  "If your joy had a shape, what would it look like?",
];

function getDayOfYear(): number {
  const today = new Date();
  return Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
}

export function getTodayPrompt(): string {
  return dailyPrompts[getDayOfYear() % dailyPrompts.length];
}

/** Returns exactly 3 deterministic, distinct prompts for today */
export function getTodayPrompts(): [string, string, string] {
  const day = getDayOfYear();
  const len = dailyPrompts.length;
  const i0 = day % len;
  const i1 = (day + 37) % len;
  const i2 = (day + 71) % len;
  return [dailyPrompts[i0], dailyPrompts[i1], dailyPrompts[i2]];
}

export function getCurrentPrompt(): string {
  const todayKey = new Date().toISOString().split("T")[0];
  try {
    const saved = JSON.parse(localStorage.getItem("ink-prompt-refresh") || "{}");
    if (saved.date === todayKey && typeof saved.promptIndex === "number") {
      return getTodayPrompts()[saved.promptIndex] ?? getTodayPrompts()[0];
    }
  } catch { /* ignore */ }
  return getTodayPrompts()[0];
}
