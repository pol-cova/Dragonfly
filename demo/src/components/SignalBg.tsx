import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../lib/theme";

export const SignalBg: React.FC<{ pulse?: boolean }> = ({ pulse = true }) => {
  const frame = useCurrentFrame();
  const drift = pulse
    ? interpolate(frame % 900, [0, 450, 900], [0, 1, 0])
    : 0;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 120% 80% at 50% ${40 + drift * 4}%, ${colors.fog} 0%, ${colors.bg} 55%, #010403 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: `
            linear-gradient(${colors.border} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.35,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
        }}
      />
    </AbsoluteFill>
  );
};
