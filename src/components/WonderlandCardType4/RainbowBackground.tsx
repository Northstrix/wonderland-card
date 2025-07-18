import React, { useEffect } from "react";

export interface RainbowBackgroundProps {
  barCount?: number;
  animationTime?: number; // in seconds
  borderRadius?: string | number;
  visible?: boolean;
}

const COLORS = [
  "rgb(232,121,249)", // purple
  "rgb(96,165,250)",  // blue
  "rgb(94,234,212)"   // green
];

function getColorCombo(n: number) {
  const combos = [
    [0, 1, 2], [0, 2, 1], [1, 0, 2],
    [1, 2, 0], [2, 1, 0], [2, 0, 1],
  ];
  return combos[n % combos.length].map(i => COLORS[i]);
}

// Only injects once per-app, class-scoped only!
function useRainbowBackgroundCSS() {
  useEffect(() => {
    if (document.getElementById("rainbow-bg-css")) return;
    const style = document.createElement("style");
    style.id = "rainbow-bg-css";
    style.textContent = `
.rainbow-bg-clipper {
  pointer-events: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
  z-index: 0;
  /* Fix: feather the white glow before it touches the edge */
  box-sizing: border-box;
  /* Fix: optional - add a tiny transparent border buffer (1-2px) */
  border: 2px solid transparent;
}

/* All units are percent, relative to card size, never vw/vh */
.rainbow-bg-bar {
  height: 100%;
  width: 0;
  top: 0;
  position: absolute;
  background: transparent;
  transform: rotate(10deg);
  transform-origin: top right;
  pointer-events: none;
  will-change: right;
  /* ensure the shadow radius doesn't flatten harshly at edge */
  border-radius: 2px;
}
.rainbow-bg-h {
  box-shadow: 0 0 32% 26% white;
  width: 100%;
  height: 0;
  bottom: 0;
  left: 0;
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.rainbow-bg-v {
  box-shadow: 0 0 21% 15% white;
  width: 0;
  height: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
@keyframes rainbow-bar-slide {
  from { right: -25%; }
  to   { right: 125%; }
}
    `;
    document.head.appendChild(style);
  }, []);
}

const RainbowBackground: React.FC<RainbowBackgroundProps> = ({
  barCount = 25,
  animationTime = 45,
  borderRadius,
  visible = false,
}) => {
  useRainbowBackgroundCSS();
  const bars = React.useMemo(() => Array.from({ length: barCount }), [barCount]);

  // White shadow tweaks: less negative offset, feathering, larger white shadow than colored glows,
  // with color shadows closer to the core and slightly smaller, to avoid color 'leaking' at the edge.
  return (
    <div
      className="rainbow-bg-clipper"
      style={{
        borderRadius,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.45s",
        background: "transparent",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {bars.map((_, i) => {
        const [c1, c2, c3] = getColorCombo(i);
        const duration =
          animationTime - (animationTime / barCount / 2) * (i + 1);
        const delay = -((i + 1) / barCount) * animationTime;
        return (
          <div
            key={i}
            className="rainbow-bg-bar"
            style={{
              zIndex: 0,
              boxShadow: [
                "-120px 0 90px 50px white", // slightly less -120px offset
                `-44px 0 38px 20px ${c1}`,  // colored glows smaller/closer
                `0 0 32px 15px ${c2}`,
                `44px 0 38px 20px ${c3}`,
                "120px 0 90px 50px white"  // white always on both ends
              ].join(", "),
              animation: `rainbow-bar-slide ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              right: 0,
            }}
          />
        );
      })}
      <div className="rainbow-bg-h" />
      <div className="rainbow-bg-v" />
    </div>
  );
};

export default RainbowBackground;
