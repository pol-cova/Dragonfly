import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KineticLine } from "../components/KineticLine";
import { SignalBg } from "../components/SignalBg";
import { copy } from "../lib/copy";
import { displayFont } from "../lib/fonts";
import { colors, fonts } from "../lib/theme";

const WingGlyph: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 180, stiffness: 70 },
  });
  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const rotate = interpolate(progress, [0, 1], [-8, 0]);

  return (
    <svg
      width={320}
      height={240}
      viewBox="0 0 320 240"
      style={{
        opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      <path
        d="M160 20 C100 80 40 100 20 140 C60 120 110 130 160 180 C210 130 260 120 300 140 C280 100 220 80 160 20 Z"
        fill="none"
        stroke={colors.fgBright}
        strokeWidth={3}
      />
      <path
        d="M160 180 L160 220 M130 210 L160 220 L190 210"
        fill="none"
        stroke={colors.amber}
        strokeWidth={2}
      />
    </svg>
  );
};

export const WingScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <SignalBg />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 160px",
          fontFamily: displayFont.fontFamily,
        }}
      >
        <div style={{ flex: 1 }}>
          <KineticLine
            text={copy.wing.headline}
            delay={0}
            size={64}
            color={colors.fgBright}
            align="left"
          />

          <div style={{ marginTop: 48 }}>
            <KineticLine
              text={`alias · ${copy.wing.alias}`}
              delay={40}
              size={40}
              color={colors.fg}
              mono
              align="left"
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <KineticLine
              text={`status · ${copy.wing.status}`}
              delay={70}
              size={32}
              color={colors.amber}
              mono
              align="left"
            />
          </div>

          <div style={{ marginTop: 56, maxWidth: 800 }}>
            <KineticLine
              text={copy.wing.board}
              delay={120}
              size={30}
              color={colors.fgDim}
              align="left"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <WingGlyph delay={30} />
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 22,
              color: colors.fgDim,
              letterSpacing: "0.1em",
            }}
          >
            WING SEED · 26E3…
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
