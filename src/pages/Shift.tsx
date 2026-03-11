import { useState, useEffect, useRef, useCallback } from "react";
import SiteFooter from "@/components/SiteFooter";

// ─── Exercise Database ───
const BODY_MOVEMENTS = [
  { id: "cross_tap", name: "Cross-Body Taps", instruction: "Touch your left hand to your right knee, then right hand to left knee. Alternate rhythmically.", intensity: "medium" },
  { id: "finger_drum", name: "Finger Drumming", instruction: "Drum your fingers on a surface: pinky → index on your left hand, then reverse on your right. Speed up gradually.", intensity: "low" },
  { id: "balance_shift", name: "Weight Shifts", instruction: "Slowly shift your weight from left foot to right. Lift the unweighted foot slightly each time.", intensity: "medium" },
  { id: "wrist_circles", name: "Opposite Wrist Circles", instruction: "Circle your left wrist clockwise and right wrist counter-clockwise at the same time. Switch after 10 seconds.", intensity: "low" },
  { id: "heel_toe", name: "Heel-Toe Rock", instruction: "Rock from heels to toes while standing. Add a slight bounce. Find a rhythm.", intensity: "low" },
  { id: "shoulder_roll", name: "Asymmetric Shoulder Rolls", instruction: "Roll your left shoulder forward while rolling your right backward. Switch after 5 rolls.", intensity: "low" },
  { id: "step_pattern", name: "Step Pattern", instruction: "Step: left-right-left-tap. Then right-left-right-tap. Keep it steady, add arm swings.", intensity: "high" },
  { id: "hand_switch", name: "Hand Open-Close", instruction: "Open your left hand while closing your right fist. Switch simultaneously. Speed up.", intensity: "low" },
];

const COGNITION_TASKS = [
  { id: "reverse_alpha", name: "Reverse Alphabet", instruction: "Say the alphabet backwards from Z, skipping every other letter: Z, X, V, T…", difficulty: "hard" },
  { id: "category_chain", name: "Category Chain", instruction: "Name a fruit, then a city, then a color — each starting with the last letter of the previous word.", difficulty: "medium" },
  { id: "count_7", name: "Sevens", instruction: "Count backwards from 100 by 7s: 100, 93, 86, 79…", difficulty: "medium" },
  { id: "word_morph", name: "Word Morph", instruction: "Think of a 4-letter word. Change one letter to make a new word. Chain as many as you can.", difficulty: "hard" },
  { id: "color_naming", name: "Mental Color Naming", instruction: "Look around the room. Name every object but say its COLOR instead of its name.", difficulty: "easy" },
  { id: "pattern_count", name: "Pattern Count", instruction: "Count to 30. Replace every multiple of 3 with 'shift' and every multiple of 5 with 'flow'.", difficulty: "medium" },
];

const PERCEPTION_TASKS = [
  { id: "sound_hunt", name: "Sound Hunting", instruction: "Close your eyes. Count every distinct sound you can hear. Try to reach at least 5. Name each one silently.", type: "audio" },
  { id: "peripheral", name: "Peripheral Scan", instruction: "Fix your eyes on one point. Without moving them, become aware of everything at the edges of your vision.", type: "visual" },
  { id: "texture_touch", name: "Texture Touch", instruction: "Touch 3 different surfaces near you. Focus on how each feels — temperature, roughness, weight.", type: "tactile" },
  { id: "breath_count", name: "Breath Awareness", instruction: "Breathe in for 4 counts, hold for 2, out for 6. Notice the temperature change between inhale and exhale.", type: "somatic" },
  { id: "body_scan", name: "Quick Body Scan", instruction: "Starting from the top of your head, slowly notice each body part down to your toes. Where is there tension? Let it go.", type: "somatic" },
  { id: "anchor_point", name: "Anchor Point", instruction: "Feel the weight of your body in the chair or your feet on the floor. Focus entirely on that sensation for 15 seconds.", type: "somatic" },
];

// ─── Energy Types ───
const ENERGY_TYPES: Record<string, { label: string; emoji: string; color: string; bg: string; description: string }> = {
  create: { label: "Create", emoji: "✦", color: "#E8A838", bg: "rgba(232, 168, 56, 0.08)", description: "Imagination, ideas, making" },
  connect: { label: "Connect", emoji: "◎", color: "#5BA88B", bg: "rgba(91, 168, 139, 0.08)", description: "People, collaboration, conversation" },
  execute: { label: "Execute", emoji: "▸", color: "#4A7FD4", bg: "rgba(74, 127, 212, 0.08)", description: "Focused doing, getting it done" },
  rest: { label: "Rest", emoji: "○", color: "#9B8EC4", bg: "rgba(155, 142, 196, 0.08)", description: "Recovery, pause, recharge" },
};

// ─── Transition Profiles ───
type TransitionProfile = {
  name: string;
  description: string;
  bodyPref: string[];
  cogPref: string[];
  perceptPref: string[];
  intensity: string;
};

const TP: Record<string, TransitionProfile> = {
  "execute_create": { name: "Unlock", description: "Break rigid patterns. Free your mind from linear thinking.", bodyPref: ["cross_tap", "step_pattern", "hand_switch"], cogPref: ["category_chain", "word_morph", "color_naming"], perceptPref: ["peripheral", "sound_hunt"], intensity: "high" },
  "execute_connect": { name: "Open Up", description: "Shift from task-focus to people-awareness.", bodyPref: ["shoulder_roll", "balance_shift", "heel_toe"], cogPref: ["color_naming", "category_chain"], perceptPref: ["sound_hunt", "breath_count", "anchor_point"], intensity: "medium" },
  "execute_rest": { name: "Unwind", description: "Release the tension of focused work.", bodyPref: ["wrist_circles", "heel_toe", "shoulder_roll"], cogPref: ["color_naming"], perceptPref: ["breath_count", "body_scan", "anchor_point"], intensity: "low" },
  "create_execute": { name: "Sharpen", description: "Channel creative energy into precise focus.", bodyPref: ["finger_drum", "hand_switch", "wrist_circles"], cogPref: ["count_7", "reverse_alpha", "pattern_count"], perceptPref: ["anchor_point", "breath_count"], intensity: "medium" },
  "create_connect": { name: "Bridge", description: "Move from inner world to shared space.", bodyPref: ["balance_shift", "shoulder_roll", "heel_toe"], cogPref: ["category_chain", "color_naming"], perceptPref: ["sound_hunt", "peripheral"], intensity: "medium" },
  "create_rest": { name: "Land", description: "Come down gently from the creative high.", bodyPref: ["heel_toe", "wrist_circles", "shoulder_roll"], cogPref: ["color_naming"], perceptPref: ["breath_count", "body_scan", "anchor_point"], intensity: "low" },
  "connect_create": { name: "Retreat Inward", description: "Move from social energy to your inner creative space.", bodyPref: ["cross_tap", "hand_switch", "finger_drum"], cogPref: ["word_morph", "category_chain"], perceptPref: ["peripheral", "texture_touch"], intensity: "medium" },
  "connect_execute": { name: "Lock In", description: "Narrow from wide social awareness to single-point focus.", bodyPref: ["finger_drum", "hand_switch", "wrist_circles"], cogPref: ["count_7", "reverse_alpha", "pattern_count"], perceptPref: ["anchor_point", "breath_count"], intensity: "medium" },
  "connect_rest": { name: "Decompress", description: "Let the social stimulation settle.", bodyPref: ["heel_toe", "balance_shift", "shoulder_roll"], cogPref: ["color_naming"], perceptPref: ["breath_count", "body_scan", "sound_hunt"], intensity: "low" },
  "rest_create": { name: "Ignite", description: "Wake up your creative circuits. Gently, then with spark.", bodyPref: ["cross_tap", "step_pattern", "hand_switch"], cogPref: ["word_morph", "category_chain", "color_naming"], perceptPref: ["peripheral", "sound_hunt"], intensity: "high" },
  "rest_execute": { name: "Boot Up", description: "Activate your focus systems like warming up an engine.", bodyPref: ["finger_drum", "heel_toe", "hand_switch"], cogPref: ["count_7", "pattern_count", "reverse_alpha"], perceptPref: ["anchor_point", "breath_count"], intensity: "medium" },
  "rest_connect": { name: "Surface", description: "Rise from stillness into social readiness.", bodyPref: ["shoulder_roll", "balance_shift", "heel_toe"], cogPref: ["category_chain", "color_naming"], perceptPref: ["sound_hunt", "peripheral"], intensity: "medium" },
  "create_create": { name: "Fresh Canvas", description: "Clear the residue of the last idea. Make room for the next.", bodyPref: ["hand_switch", "wrist_circles", "cross_tap"], cogPref: ["word_morph", "category_chain"], perceptPref: ["peripheral", "sound_hunt", "texture_touch"], intensity: "medium" },
  "connect_connect": { name: "Reset Room", description: "Different people, different energy. Arrive fresh.", bodyPref: ["shoulder_roll", "balance_shift", "heel_toe"], cogPref: ["pattern_count", "color_naming"], perceptPref: ["breath_count", "anchor_point", "sound_hunt"], intensity: "low" },
  "execute_execute": { name: "Context Clear", description: "Flush the old task. Make space for clean focus.", bodyPref: ["finger_drum", "hand_switch", "heel_toe"], cogPref: ["count_7", "reverse_alpha"], perceptPref: ["anchor_point", "breath_count"], intensity: "medium" },
  "rest_rest": { name: "Deeper Down", description: "You're already resting. Sink a little further.", bodyPref: ["heel_toe", "wrist_circles"], cogPref: ["color_naming"], perceptPref: ["body_scan", "breath_count", "anchor_point"], intensity: "low" },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Exercise = {
  profile: TransitionProfile;
  body: (typeof BODY_MOVEMENTS)[number];
  cognition: (typeof COGNITION_TASKS)[number];
  perception: (typeof PERCEPTION_TASKS)[number];
};

function generateExercise(from: string, to: string): Exercise | null {
  const key = `${from}_${to}`;
  const profile = TP[key];
  if (!profile) return null;
  const body = pickRandom(profile.bodyPref.map(id => BODY_MOVEMENTS.find(b => b.id === id)).filter(Boolean) as (typeof BODY_MOVEMENTS)[number][]);
  const cog = pickRandom(profile.cogPref.map(id => COGNITION_TASKS.find(c => c.id === id)).filter(Boolean) as (typeof COGNITION_TASKS)[number][]);
  const percept = pickRandom(profile.perceptPref.map(id => PERCEPTION_TASKS.find(p => p.id === id)).filter(Boolean) as (typeof PERCEPTION_TASKS)[number][]);
  return { profile, body, cognition: cog, perception: percept };
}

// ─── Phase config ───
const PHASES = [
  { id: "body", label: "Body", icon: "◇", color: "#E8A838", duration: 60 },
  { id: "cognition", label: "Cognition", icon: "◈", color: "#4A7FD4", duration: 60 },
  { id: "perception", label: "Perception", icon: "◉", color: "#9B8EC4", duration: 60 },
];

// ─── Components ───

function EnergyButton({ type, data, selected, onClick, compact = false }: {
  type: string;
  data: (typeof ENERGY_TYPES)[string];
  selected: string | null;
  onClick: (type: string) => void;
  compact?: boolean;
}) {
  const isSelected = selected === type;
  return (
    <button onClick={() => onClick(type)}
      style={{
        display: "flex", flexDirection: compact ? "row" : "column", alignItems: "center",
        gap: compact ? "10px" : "8px",
        padding: compact ? "10px 12px" : "18px 14px",
        borderRadius: compact ? "12px" : "16px",
        border: isSelected ? `2px solid ${data.color}` : "2px solid rgba(255,255,255,0.06)",
        background: isSelected ? data.bg : "rgba(255,255,255,0.02)",
        cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        flex: 1, minWidth: 0,
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        boxShadow: isSelected ? `0 4px 24px ${data.color}22` : "none",
      }}>
      <span style={{
        fontSize: compact ? "16px" : "22px", color: isSelected ? data.color : "rgba(255,255,255,0.3)",
        transition: "color 0.3s", fontFamily: "'JetBrains Mono', monospace",
      }}>{data.emoji}</span>
      <div style={{ textAlign: compact ? "left" : "center" }}>
        <div style={{
          fontSize: compact ? "12px" : "13px", fontWeight: 600,
          color: isSelected ? data.color : "rgba(255,255,255,0.5)",
          letterSpacing: "0.05em", textTransform: "uppercase", transition: "color 0.3s",
        }}>{data.label}</div>
        {!compact && (
          <div style={{
            fontSize: "10px", color: "rgba(255,255,255,0.25)",
            marginTop: "3px", lineHeight: 1.3,
          }}>{data.description}</div>
        )}
      </div>
    </button>
  );
}

function Timer({ duration, color, onComplete }: {
  duration: number;
  color: string;
  onComplete?: () => void;
}) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => { setRemaining(duration); setRunning(false); }, [duration]);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (onCompleteRef.current) onCompleteRef.current();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining]);

  const progress = 1 - remaining / duration;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const r = 50;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div style={{ position: "relative", width: "112px", height: "112px" }}>
        <svg width="112" height="112" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <circle cx="56" cy="56" r={r} fill="none"
            stroke={color} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
            transform="rotate(-90 56 56)"
            style={{ transition: "stroke-dashoffset 1s linear", opacity: 0.75 }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "22px", fontWeight: 300,
          color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em",
        }}>{mins}:{secs.toString().padStart(2, "0")}</div>
      </div>
      <button onClick={() => remaining > 0 && setRunning(r => !r)}
        style={{
          padding: "7px 26px", borderRadius: "18px",
          border: `1.5px solid ${color}40`,
          background: running ? "rgba(255,255,255,0.02)" : `${color}12`,
          color, fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase",
          cursor: remaining > 0 ? "pointer" : "default",
          transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
          opacity: remaining === 0 ? 0.35 : 1,
        }}>
        {remaining === 0 ? "Done" : running ? "Pause" : "Start"}
      </button>
    </div>
  );
}

function PhaseTracker({ currentPhase }: { currentPhase: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center", justifyContent: "center" }}>
      {PHASES.map((p, i) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 13px", borderRadius: "16px",
            background: i === currentPhase ? "rgba(255,255,255,0.06)" : i < currentPhase ? `${p.color}08` : "transparent",
            border: i === currentPhase ? `1px solid ${p.color}30` : "1px solid transparent",
            transition: "all 0.5s ease",
          }}>
            <span style={{
              fontSize: "10px", fontFamily: "'JetBrains Mono', monospace",
              color: i <= currentPhase ? p.color : "rgba(255,255,255,0.1)",
              transition: "all 0.5s",
              opacity: i < currentPhase ? 0.5 : 1,
            }}>{i < currentPhase ? "✓" : p.icon}</span>
            <span style={{
              fontSize: "10px", fontWeight: i === currentPhase ? 600 : 400,
              color: i === currentPhase ? "rgba(255,255,255,0.65)" : i < currentPhase ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
              letterSpacing: "0.05em", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.5s",
            }}>{p.label}</span>
          </div>
          {i < PHASES.length - 1 && (
            <div style={{
              width: "14px", height: "1px",
              background: i < currentPhase ? `${PHASES[i + 1].color}25` : "rgba(255,255,255,0.06)",
              margin: "0 1px", transition: "all 0.5s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function ExerciseFlow({ exercise, fromColor, toColor, onComplete }: {
  exercise: Exercise;
  fromColor: string;
  toColor: string;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState(0);

  const phaseTransitionMessages = [
    null,
    "Good. Keep moving. Now add a cognitive challenge on top.",
    "Stop. Be still. Time to ground and arrive.",
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "24px",
      animation: "shiftFadeIn 0.5s ease",
    }}>
      <PhaseTracker currentPhase={phase} />

      {phase > 0 && (
        <div key={`msg-${phase}`} style={{
          animation: "shiftSlideUp 0.5s ease",
          padding: "10px 20px", borderRadius: "12px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
          fontSize: "12px", color: "rgba(255,255,255,0.4)",
          textAlign: "center", fontStyle: "italic",
          maxWidth: "360px", lineHeight: 1.5,
        }}>{phaseTransitionMessages[phase]}</div>
      )}

      {/* Phase 0: Body only */}
      {phase === 0 && (
        <div key="phase-body" style={{
          animation: "shiftSlideUp 0.4s ease",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%",
        }}>
          <div style={{
            padding: "24px 22px", borderRadius: "18px",
            background: "linear-gradient(145deg, rgba(232,168,56,0.05), transparent)",
            border: "1px solid rgba(232,168,56,0.08)",
            width: "100%", maxWidth: "420px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", color: "#E8A838", fontFamily: "'JetBrains Mono', monospace" }}>◇</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#E8A838", letterSpacing: "0.06em", textTransform: "uppercase" }}>Body</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace" }}>cross-lateral movement</span>
            </div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: "6px" }}>{exercise.body.name}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{exercise.body.instruction}</div>
          </div>
          <Timer key="timer-body" duration={60} color="#E8A838" onComplete={() => setPhase(1)} />
          <button onClick={() => setPhase(1)}
            style={{
              padding: "7px 18px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.06)", background: "transparent",
              color: "rgba(255,255,255,0.2)", fontSize: "11px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
            }}>Next: Add Cognition →</button>
        </div>
      )}

      {/* Phase 1: Body + Cognition */}
      {phase === 1 && (
        <div key="phase-cog" style={{
          animation: "shiftSlideUp 0.4s ease",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%",
        }}>
          <div style={{
            padding: "24px 22px", borderRadius: "18px",
            background: "linear-gradient(145deg, rgba(232,168,56,0.04), rgba(74,127,212,0.04))",
            border: "1px solid rgba(255,255,255,0.05)",
            width: "100%", maxWidth: "420px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#E8A838", fontFamily: "'JetBrains Mono', monospace" }}>◇</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#E8A838", letterSpacing: "0.06em", textTransform: "uppercase" }}>Body</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.12)", margin: "0 2px" }}>—</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>keep going</span>
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.5, marginBottom: "16px", paddingLeft: "1px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{exercise.body.name}</span> — maintain your movement rhythm
            </div>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 -6px 16px" }} />
            <div style={{
              padding: "16px 18px", borderRadius: "14px",
              background: "rgba(74,127,212,0.06)",
              border: "1px solid rgba(74,127,212,0.12)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "-9px", left: "16px",
                padding: "2px 10px", borderRadius: "6px",
                background: "#0B0C0E",
                border: "1px solid rgba(74,127,212,0.2)",
                fontSize: "9px", fontWeight: 700, color: "#4A7FD4",
                letterSpacing: "0.07em", textTransform: "uppercase",
              }}>+ add while moving</div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px", marginTop: "4px" }}>
                <span style={{ fontSize: "12px", color: "#4A7FD4", fontFamily: "'JetBrains Mono', monospace" }}>◈</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#4A7FD4", letterSpacing: "0.06em", textTransform: "uppercase" }}>Cognition</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.12)", fontFamily: "'JetBrains Mono', monospace" }}>dual-task challenge</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "5px" }}>{exercise.cognition.name}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{exercise.cognition.instruction}</div>
            </div>
          </div>
          <Timer key="timer-cog" duration={60} color="#4A7FD4" onComplete={() => setPhase(2)} />
          <button onClick={() => setPhase(2)}
            style={{
              padding: "7px 18px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.06)", background: "transparent",
              color: "rgba(255,255,255,0.2)", fontSize: "11px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
            }}>Next: Perception →</button>
        </div>
      )}

      {/* Phase 2: Perception (Ground) */}
      {phase === 2 && (
        <div key="phase-percept" style={{
          animation: "shiftSlideUp 0.4s ease",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%",
        }}>
          <div style={{
            padding: "28px 24px", borderRadius: "18px",
            background: `linear-gradient(145deg, ${toColor}06, transparent)`,
            border: `1px solid ${toColor}10`,
            width: "100%", maxWidth: "420px", textAlign: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", color: "#9B8EC4", fontFamily: "'JetBrains Mono', monospace" }}>◉</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#9B8EC4", letterSpacing: "0.06em", textTransform: "uppercase" }}>Perception</span>
            </div>
            <div style={{
              fontSize: "11px", color: "rgba(255,255,255,0.22)",
              marginBottom: "18px", letterSpacing: "0.02em", lineHeight: 1.5,
              fontStyle: "italic",
            }}>Stop moving. Be still. Tune into your senses.</div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.72)", marginBottom: "6px" }}>{exercise.perception.name}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{exercise.perception.instruction}</div>
          </div>
          <Timer key="timer-percept" duration={60} color="#9B8EC4" onComplete={onComplete} />
          <button onClick={onComplete}
            style={{
              padding: "12px 36px", borderRadius: "24px",
              border: "none",
              background: `${toColor}40`,
              color: "white", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.05em",
              transition: "all 0.3s",
              boxShadow: `0 6px 24px ${toColor}18`,
            }}>I'm shifted ✓</button>
        </div>
      )}
    </div>
  );
}

// ─── Mobile detection ───
function useIsMobile(breakpoint = 480) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── Main Shift Page ───
export default function Shift() {
  const [screen, setScreen] = useState<"home" | "exercise" | "complete">("home");
  const [fromEnergy, setFromEnergy] = useState<string | null>(null);
  const [toEnergy, setToEnergy] = useState<string | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [shiftCount, setShiftCount] = useState(0);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleToEnergySelect = useCallback((type: string) => {
    setToEnergy(type);
    // Scroll the preview/Begin Shift into view after render
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  const startShift = useCallback(() => {
    if (fromEnergy && toEnergy) {
      setExercise(generateExercise(fromEnergy, toEnergy));
      setScreen("exercise");
    }
  }, [fromEnergy, toEnergy]);

  const completeShift = () => {
    setShiftCount(c => c + 1);
    setSelectedFeeling(null);
    setScreen("complete");
  };

  const reset = () => {
    setFromEnergy(null);
    setToEnergy(null);
    setExercise(null);
    setSelectedFeeling(null);
    setScreen("home");
  };

  const profile = fromEnergy && toEnergy ? TP[`${fromEnergy}_${toEnergy}`] : null;
  const isSameType = fromEnergy && toEnergy && fromEnergy === toEnergy;

  return (
    <div style={{
      minHeight: "100vh", background: "#0B0C0E", color: "white",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 20px", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap');
        @keyframes shiftFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shiftSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shiftFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      {/* Header */}
      <header style={{
        width: "100%", maxWidth: "480px",
        padding: "24px 0 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={screen !== "home" ? reset : undefined}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "7px",
            background: "linear-gradient(135deg, #E8A838 0%, #4A7FD4 50%, #9B8EC4 100%)",
            opacity: 0.75,
          }} />
          <span style={{
            fontSize: "15px", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}>Shift</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {shiftCount > 0 && (
            <div style={{
              fontSize: "11px", color: "rgba(255,255,255,0.2)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>{shiftCount} shift{shiftCount !== 1 ? "s" : ""}</div>
          )}
          {screen !== "home" && (
            <button onClick={reset}
              style={{
                padding: "5px 12px", borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
                color: "rgba(255,255,255,0.3)", fontSize: "11px", cursor: "pointer",
              }}>✕</button>
          )}
        </div>
      </header>

      <main style={{
        width: "100%", maxWidth: "480px", flex: 1,
        display: "flex", flexDirection: "column", paddingBottom: isMobile ? "20px" : "40px",
      }}>
        {/* HOME */}
        {screen === "home" && (
          <div style={{ animation: "shiftFadeIn 0.5s ease", display: "flex", flexDirection: "column", gap: isMobile ? (toEnergy ? "12px" : "20px") : "36px", paddingTop: isMobile ? "4px" : "16px" }}>
            {/* Hero — collapses on mobile once both selections are made */}
            {!(isMobile && toEnergy) && (
              <div style={{ textAlign: "center" }}>
                <h1 style={{
                  fontSize: isMobile ? "22px" : "26px", fontWeight: 300,
                  color: "rgba(255,255,255,0.85)", lineHeight: 1.35,
                  marginBottom: "6px", letterSpacing: "-0.01em",
                }}>Reset your mind<br />between modes</h1>
                <p style={{
                  fontSize: isMobile ? "12px" : "13px", color: "rgba(255,255,255,0.28)", lineHeight: 1.5,
                }}>3 minutes. Body → Cognition → Perception.<br />A neural shift matched to your transition.</p>
              </div>
            )}

            {/* FROM */}
            <div>
              <div style={{
                fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)", marginBottom: isMobile ? "6px" : "10px",
              }}>Coming from</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? "6px" : "8px" }}>
                {Object.entries(ENERGY_TYPES).map(([key, data]) => (
                  <EnergyButton key={key} type={key} data={data} selected={fromEnergy}
                    compact={isMobile}
                    onClick={(t) => { setFromEnergy(t); setToEnergy(null); }} />
                ))}
              </div>
            </div>

            {/* TO */}
            {fromEnergy && (
              <div style={{ animation: "shiftSlideUp 0.35s ease" }}>
                <div style={{
                  fontSize: "11px", fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)", marginBottom: isMobile ? "6px" : "10px",
                }}>Going into</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? "6px" : "8px" }}>
                  {Object.entries(ENERGY_TYPES).map(([key, data]) => (
                    <EnergyButton key={key} type={key} data={data} selected={toEnergy} compact={isMobile} onClick={handleToEnergySelect} />
                  ))}
                </div>
                {!toEnergy && (
                  <div style={{
                    marginTop: "8px", fontSize: "11px",
                    color: "rgba(255,255,255,0.15)", textAlign: "center",
                    fontStyle: "italic",
                  }}>Same mode works too — switching tasks still needs a reset</div>
                )}
              </div>
            )}

            {/* Preview */}
            {fromEnergy && toEnergy && profile && (
              <div ref={previewRef} style={{ animation: "shiftSlideUp 0.4s ease", textAlign: "center" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: isMobile ? "10px" : "14px", marginBottom: isMobile ? "10px" : "18px",
                }}>
                  <div style={{
                    padding: "5px 12px", borderRadius: "10px",
                    background: ENERGY_TYPES[fromEnergy].bg,
                    fontSize: "11px", fontWeight: 600, color: ENERGY_TYPES[fromEnergy].color,
                  }}>{ENERGY_TYPES[fromEnergy].label}</div>
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                    <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{
                    padding: "5px 12px", borderRadius: "10px",
                    background: ENERGY_TYPES[toEnergy].bg,
                    fontSize: "11px", fontWeight: 600, color: ENERGY_TYPES[toEnergy].color,
                  }}>{ENERGY_TYPES[toEnergy].label}</div>
                </div>
                <div style={{
                  fontSize: isMobile ? "18px" : "20px", fontWeight: 600,
                  color: "rgba(255,255,255,0.8)", marginBottom: "4px",
                }}>{profile.name}</div>
                <div style={{
                  fontSize: isMobile ? "12px" : "13px", color: "rgba(255,255,255,0.32)",
                  marginBottom: "6px", lineHeight: 1.5,
                }}>{profile.description}</div>
                {isSameType && (
                  <div style={{
                    display: "inline-block", padding: "4px 12px",
                    borderRadius: "8px", background: `${ENERGY_TYPES[fromEnergy].color}10`,
                    border: `1px solid ${ENERGY_TYPES[fromEnergy].color}15`,
                    fontSize: "10px", color: ENERGY_TYPES[fromEnergy].color,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginBottom: "6px", opacity: 0.7,
                  }}>same mode · new task</div>
                )}
                <div style={{
                  display: "flex", gap: "14px", justifyContent: "center",
                  marginBottom: isMobile ? "14px" : "24px", fontSize: "11px",
                  color: "rgba(255,255,255,0.18)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <span>3 min</span>
                  <span>·</span>
                  <span>{profile.intensity}</span>
                  <span>·</span>
                  <span>3 phases</span>
                </div>
                <button onClick={startShift}
                  style={{
                    padding: "14px 52px", borderRadius: "28px", border: "none",
                    background: isSameType
                      ? `${ENERGY_TYPES[fromEnergy].color}50`
                      : `linear-gradient(135deg, ${ENERGY_TYPES[fromEnergy].color}70, ${ENERGY_TYPES[toEnergy].color}70)`,
                    color: "white", fontSize: "14px", fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.3s",
                    boxShadow: `0 8px 32px ${ENERGY_TYPES[toEnergy].color}18`,
                  }}>Begin Shift</button>
              </div>
            )}
          </div>
        )}

        {/* EXERCISE */}
        {screen === "exercise" && exercise && fromEnergy && toEnergy && (
          <div style={{
            animation: "shiftFadeIn 0.5s ease",
            display: "flex", flexDirection: "column", gap: "20px", paddingTop: "8px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", marginBottom: "10px",
              }}>
                <div style={{
                  padding: "5px 12px", borderRadius: "10px",
                  background: ENERGY_TYPES[fromEnergy].bg,
                  border: `1px solid ${ENERGY_TYPES[fromEnergy].color}18`,
                  fontSize: "11px", fontWeight: 600, color: ENERGY_TYPES[fromEnergy].color,
                }}>{ENERGY_TYPES[fromEnergy].label}</div>
                <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "12px" }}>→</span>
                <div style={{
                  padding: "5px 12px", borderRadius: "10px",
                  background: ENERGY_TYPES[toEnergy].bg,
                  border: `1px solid ${ENERGY_TYPES[toEnergy].color}18`,
                  fontSize: "11px", fontWeight: 600, color: ENERGY_TYPES[toEnergy].color,
                }}>{ENERGY_TYPES[toEnergy].label}</div>
              </div>
              <div style={{
                fontSize: "20px", fontWeight: 600,
                color: "rgba(255,255,255,0.8)", marginBottom: "3px",
              }}>{exercise.profile.name}</div>
              <div style={{
                fontSize: "12px", color: "rgba(255,255,255,0.28)",
              }}>{exercise.profile.description}</div>
            </div>
            <ExerciseFlow
              exercise={exercise}
              fromColor={ENERGY_TYPES[fromEnergy].color}
              toColor={ENERGY_TYPES[toEnergy].color}
              onComplete={completeShift}
            />
          </div>
        )}

        {/* COMPLETE */}
        {screen === "complete" && toEnergy && (
          <div style={{
            animation: "shiftFadeIn 0.6s ease",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            flex: 1, gap: "28px", textAlign: "center", paddingTop: "48px",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: `${ENERGY_TYPES[toEnergy].color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", color: ENERGY_TYPES[toEnergy].color,
              animation: "shiftFloat 3s ease-in-out infinite",
            }}>{ENERGY_TYPES[toEnergy].emoji}</div>
            <div>
              <div style={{
                fontSize: "22px", fontWeight: 300,
                color: "rgba(255,255,255,0.85)", marginBottom: "8px",
              }}>Shifted.</div>
              <div style={{
                fontSize: "13px", color: "rgba(255,255,255,0.32)", lineHeight: 1.6,
              }}>
                You're in <span style={{ color: ENERGY_TYPES[toEnergy].color, fontWeight: 600 }}>{ENERGY_TYPES[toEnergy].label}</span> mode now.
                {isSameType && <><br />Fresh context. Clean slate.</>}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: "10px", fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)", marginBottom: "10px",
              }}>How do you feel?</div>
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", justifyContent: "center" }}>
                {["Refreshed", "Focused", "Calm", "Energized", "Amused"].map(f => (
                  <button key={f} onClick={() => setSelectedFeeling(f)}
                    style={{
                      padding: "7px 16px", borderRadius: "18px",
                      border: selectedFeeling === f
                        ? `1.5px solid ${ENERGY_TYPES[toEnergy].color}55`
                        : "1.5px solid rgba(255,255,255,0.07)",
                      background: selectedFeeling === f
                        ? `${ENERGY_TYPES[toEnergy].color}12`
                        : "rgba(255,255,255,0.02)",
                      color: selectedFeeling === f
                        ? ENERGY_TYPES[toEnergy].color
                        : "rgba(255,255,255,0.35)",
                      fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                    }}>{f}</button>
                ))}
              </div>
            </div>
            <button onClick={reset}
              style={{
                marginTop: "20px", padding: "13px 44px",
                borderRadius: "26px", border: "none",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.55)",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                letterSpacing: "0.04em",
              }}>New Shift</button>
          </div>
        )}
      </main>

      {/* Footer */}
      <div style={{ width: "100vw", marginLeft: "-20px" }}>
        <SiteFooter />
      </div>
    </div>
  );
}
