import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../lib/theme";

type Props = {
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  mono?: boolean;
  align?: "left" | "center";
};

export const KineticLine: React.FC<Props> = ({
  text,
  delay = 0,
  size = 56,
  color = colors.fgBright,
  mono = false,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 120 },
  });
  const y = interpolate(progress, [0, 1], [28, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: mono ? fonts.mono : fonts.display,
        fontSize: size,
        fontWeight: mono ? 500 : 700,
        color,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: align,
        letterSpacing: mono ? "0.04em" : "-0.02em",
        lineHeight: 1.15,
      }}
    >
      {text}
    </div>
  );
};
