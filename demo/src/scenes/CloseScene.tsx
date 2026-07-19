import { AbsoluteFill } from "remotion";
import { KineticLine } from "../components/KineticLine";
import { SignalBg } from "../components/SignalBg";
import { copy } from "../lib/copy";
import { displayFont } from "../lib/fonts";
import { colors, fonts } from "../lib/theme";

export const CloseScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <SignalBg />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 120,
          fontFamily: displayFont.fontFamily,
          textAlign: "center",
        }}
      >
        <KineticLine
          text={copy.close.vision}
          delay={0}
          size={48}
          color={colors.fgBright}
        />

        <div style={{ marginTop: 72 }}>
          <KineticLine
            text={copy.close.cta}
            delay={50}
            size={36}
            color={colors.amber}
          />
        </div>

        <div style={{ marginTop: 32 }}>
          <KineticLine
            text={copy.liveUrlHref}
            delay={80}
            size={32}
            color={colors.fgBright}
            mono
          />
        </div>

        <div style={{ marginTop: 48 }}>
          <KineticLine
            text={copy.close.repo}
            delay={110}
            size={24}
            color={colors.fgDim}
            mono
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontFamily: fonts.display,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: colors.fgDim,
            opacity: 0.4,
          }}
        >
          {copy.product}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
