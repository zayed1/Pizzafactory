import { useOfficeGame } from "../lib/stores/useOfficeGame";

const TUTORIAL_STEPS = [
  { text: "Welcome to Pizza Factory! Let's learn the basics.", target: "none", icon: "\u{1F355}" },
  { text: "Walk to the DOUGH station (left) to pick up dough.", target: "dough", icon: "\u{1FAD3}" },
  { text: "Bring the dough to an OVEN to bake it.", target: "oven", icon: "\u{1F525}" },
  { text: "Wait for cooking, then take the pizza to PREP.", target: "prep", icon: "\u{2702}\uFE0F" },
  { text: "Pick up the prepared pizza and serve it to a TABLE!", target: "table", icon: "\u{1F37D}\uFE0F" },
];

export function TutorialOverlay() {
  const tutorialStep = useOfficeGame((s) => s.tutorialStep);
  const tutorialDone = useOfficeGame((s) => s.tutorialDone);
  const advanceTutorial = useOfficeGame((s) => s.advanceTutorial);
  const skipTutorial = useOfficeGame((s) => s.skipTutorial);
  const carrying = useOfficeGame((s) => s.carrying);

  if (tutorialStep < 0 || tutorialDone) return null;

  // Auto-advance based on player actions
  const step = TUTORIAL_STEPS[tutorialStep];
  if (!step) return null;

  // Check if step condition met for auto-advance
  if (tutorialStep === 1 && carrying === "dough") {
    setTimeout(advanceTutorial, 500);
  } else if (tutorialStep === 2 && carrying === "none") {
    // Placed dough in oven
    setTimeout(advanceTutorial, 500);
  } else if (tutorialStep === 3 && carrying === "pizza_ready") {
    setTimeout(advanceTutorial, 500);
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        pointerEvents: "auto",
        animation: "notif-slide 0.4s ease-out",
      }}
    >
      <div style={{
        background: "rgba(0,0,0,0.92)",
        borderRadius: 16,
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: "2px solid rgba(59,130,246,0.5)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 30px rgba(59,130,246,0.3)",
        maxWidth: 420,
      }}>
        <span style={{ fontSize: 32 }}>{step.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            color: "#e2e8f0",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.5,
          }}>
            {step.text}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: 10,
            marginTop: 4,
            fontFamily: "'Inter', sans-serif",
          }}>
            Step {tutorialStep + 1}/{TUTORIAL_STEPS.length}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
          {tutorialStep === 0 && (
            <button
              onClick={advanceTutorial}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Go!
            </button>
          )}
          <button
            onClick={skipTutorial}
            style={{
              background: "transparent",
              border: "1px solid #475569",
              borderRadius: 8,
              padding: "4px 10px",
              color: "#94a3b8",
              fontSize: 9,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
