export interface JourneyStep {
  prompt: string;
  durationMinutes: number;
  instruction?: string;
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: JourneyStep[];
  totalMinutes: number;
}

export const journeys: Journey[] = [
  {
    id: "weekly-review",
    title: "The Weekly Review",
    description: "Reflect on the past week with honesty and compassion.",
    icon: "calendar-days",
    totalMinutes: 20,
    steps: [
      {
        prompt: "What moments from this week made you feel most alive? Let every small flicker count.",
        durationMinutes: 7,
        instruction: "Write freely. No editing.",
      },
      {
        prompt: "What drained your energy this week? Name it without judgment.",
        durationMinutes: 7,
        instruction: "Be honest with yourself.",
      },
      {
        prompt: "What is one intention you want to carry into next week? What is one promise you want to make to yourself?",
        durationMinutes: 6,
        instruction: "Close with clarity.",
      },
    ],
  },
  {
    id: "anxiety-release",
    title: "Anxiety Release",
    description: "A guided practice to untangle anxious thoughts on paper.",
    icon: "wind",
    totalMinutes: 27,
    steps: [
      {
        prompt: "Write down all anxious thoughts swirling in your mind right now. Just dump, without trying to solve anything.",
        durationMinutes: 5,
        instruction: "Stream of consciousness. No pauses.",
      },
      {
        prompt: "Pick the loudest worry. Describe it as if it were a weather pattern. What kind of storm is it?",
        durationMinutes: 6,
        instruction: "Use metaphor to create distance.",
      },
      {
        prompt: "What is the worst case you're imagining?",
        durationMinutes: 6,
        instruction: "Write it out fully. Go through the worst case scenario.",
      },
      {
        prompt: "What could you still do? Who could help? What could happen instead?",
        durationMinutes: 5,
        instruction: "Challenge the narrative.",
      },
      {
        prompt: "Write three things that are true and safe right now. Ground yourself in this moment.",
        durationMinutes: 5,
        instruction: "Return to the present.",
      },
    ],
  },
  {
    id: "creative-unblocking",
    title: "Creative Unblocking",
    description: "Shake loose the ideas stuck behind your inner critic.",
    icon: "sparkles",
    totalMinutes: 18,
    steps: [
      {
        prompt: "Write the most absurd, terrible idea you can think of. Make it ridiculous. Make it fun.",
        durationMinutes: 5,
        instruction: "Permission to be awful.",
      },
      {
        prompt: "What creative work has inspired you recently? Describe how it made you feel, not what it was about.",
        durationMinutes: 7,
        instruction: "Feel, don't analyze.",
      },
      {
        prompt: "If you had no audience and no consequences, what would you create today? Describe it in vivid detail.",
        durationMinutes: 6,
        instruction: "Dream without limits.",
      },
    ],
  },
  {
    id: "gratitude-deep-dive",
    title: "Gratitude Deep Dive",
    description: "Go beyond 'I'm grateful for...' into the texture of thankfulness.",
    icon: "heart",
    totalMinutes: 15,
    steps: [
      {
        prompt: "Describe one person who made your day better recently. What exactly did they do, and how did it land?",
        durationMinutes: 5,
        instruction: "Be specific and vivid.",
      },
      {
        prompt: "Write about a difficulty that, looking back, taught you something valuable. Thank it.",
        durationMinutes: 5,
        instruction: "Find the hidden gift.",
      },
      {
        prompt: "What part of your daily routine do you usually overlook? Write a love letter to that small ritual.",
        durationMinutes: 5,
        instruction: "Celebrate the mundane.",
      },
    ],
  },
  {
    id: "morning-pages",
    title: "Morning Pages",
    description: "The classic: three pages of unfiltered morning consciousness.",
    icon: "sunrise",
    totalMinutes: 20,
    steps: [
      {
        prompt: "Begin writing. Don't think, don't edit, don't stop. Let whatever is inside come out onto the page.",
        durationMinutes: 10,
        instruction: "Keep the pen moving. Always.",
      },
      {
        prompt: "Continue. You're past the surface now. What's underneath? Keep going.",
        durationMinutes: 10,
        instruction: "Go deeper. No stopping.",
      },
    ],
  },
];
