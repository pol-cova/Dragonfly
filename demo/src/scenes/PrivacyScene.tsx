import { AbsoluteFill } from "remotion";
import { KineticLine } from "../components/KineticLine";
import { SignalBg } from "../components/SignalBg";
import { TypewriterLine } from "../components/TypewriterLine";
import { copy } from "../lib/copy";
import { displayFont } from "../lib/fonts";
import { colors, fonts } from "../lib/theme";

export const PrivacyScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <SignalBg pulse={false} />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 160px",
          fontFamily: displayFont.fontFamily,
        }}
      >
        <KineticLine
          text={copy.privacy.headline}
          delay={0}
          size={64}
          color={colors.amber}
          align="left"
        />

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 36 }}>
          {copy.privacy.points.map((point, index) => (
            <div key={point} style={{ maxWidth: 1300 }}>
              <TypewriterLine
                text={point}
                startFrame={30 + index * 55}
                size={32}
                color={colors.fg}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 72,
            padding: "28px 36px",
            borderLeft: `4px solid ${colors.fgBright}`,
            background: colors.panel,
            maxWidth: 1100,
          }}
        >
          <KineticLine
            text={copy.privacy.honest}
            delay={280}
            size={34}
            color={colors.fgBright}
            align="left"
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: 120,
            bottom: 100,
            fontFamily: fonts.mono,
            fontSize: 20,
            color: colors.fgDim,
            letterSpacing: "0.08em",
          }}
        >
          claimWing.compact
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
