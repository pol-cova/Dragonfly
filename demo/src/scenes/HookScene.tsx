import { AbsoluteFill } from "remotion";
import { KineticLine } from "../components/KineticLine";
import { SignalBg } from "../components/SignalBg";
import { copy } from "../lib/copy";
import { displayFont } from "../lib/fonts";
import { colors } from "../lib/theme";

export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <SignalBg />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 160px",
          fontFamily: displayFont.fontFamily,
        }}
      >
        {copy.hook.lines.map((line, index) => (
          <div key={line} style={{ marginBottom: 28 }}>
            <KineticLine
              text={line}
              delay={index * 22}
              size={72}
              color={index === 2 ? colors.amber : colors.fgBright}
              align="left"
            />
          </div>
        ))}
        <div style={{ marginTop: 48, maxWidth: 1200 }}>
          <KineticLine
            text={copy.hook.punch}
            delay={90}
            size={36}
            color={colors.fg}
            align="left"
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
