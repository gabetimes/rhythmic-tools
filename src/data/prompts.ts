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
];

export function getTodayPrompt(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyPrompts[dayOfYear % dailyPrompts.length];
}
