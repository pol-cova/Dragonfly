import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../lib/theme";

type Props = {
  num: string;
  title: string;
  desc: string;
  delay?: number;
};

export const StageCard: React.FC<Props> = ({ num, title, desc, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const x = interpolate(progress, [0, 1], [-40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        borderLeft: `3px solid ${colors.amber}`,
        paddingLeft: 28,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 36,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 18,
          color: colors.fgDim,
          marginBottom: 8,
        }}
      >
        STAGE {num}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 44,
          fontWeight: 700,
          color: colors.fgBright,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 26,
          color: colors.fg,
          maxWidth: 720,
        }}
      >
        {desc}
      </div>
    </div>
  );
};
