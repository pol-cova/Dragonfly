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
import { colors, fonts, secondsToFrames } from "../lib/theme";

const VOICE_END = secondsToFrames(9.2);
const LOGO_START = secondsToFrames(8.5);

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subtitleOpacity = interpolate(
    frame,
    [0, 12, VOICE_END - 15, VOICE_END],
    [0, 1, 1, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const logoSpring = spring({
    frame: frame - LOGO_START,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.94, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const subDelay = LOGO_START + 35;

  return (
    <AbsoluteFill>
      <SignalBg />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 100px",
          fontFamily: displayFont.fontFamily,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 100,
            right: 100,
            opacity: subtitleOpacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "28px 40px",
              borderLeft: `4px solid ${colors.amber}`,
              background: "rgba(7, 16, 12, 0.85)",
              maxWidth: 1400,
            }}
          >
            <p
              style={{
                fontFamily: fonts.display,
                fontSize: 38,
                fontWeight: 500,
                color: colors.fgBright,
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              {copy.intro.greeting}
            </p>
          </div>
        </div>

        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: colors.fgBright,
              textShadow: `0 0 80px ${colors.fog}`,
            }}
          >
            {copy.intro.productLine}
          </div>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 28,
              color: colors.amber,
              marginTop: 24,
              letterSpacing: "0.12em",
            }}
          >
            {copy.tagline.toUpperCase()}
          </div>
        </div>

        <div style={{ marginTop: 56, maxWidth: 1100, opacity: logoOpacity }}>
          <KineticLine
            text={copy.intro.sub}
            delay={subDelay}
            size={40}
            color={colors.fgBright}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
