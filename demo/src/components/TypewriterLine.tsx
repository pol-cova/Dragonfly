import { useCurrentFrame } from "remotion";
import { colors, fonts } from "../lib/theme";

type Props = {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  size?: number;
  color?: string;
  mono?: boolean;
};

export const TypewriterLine: React.FC<Props> = ({
  text,
  startFrame = 0,
  charsPerFrame = 1.2,
  size = 42,
  color = colors.fg,
  mono = true,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const visible = text.slice(0, visibleChars);
  const showCursor = visibleChars < text.length && Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: mono ? fonts.mono : fonts.display,
        fontSize: size,
        fontWeight: 500,
        color,
        letterSpacing: mono ? "0.02em" : "-0.01em",
        lineHeight: 1.4,
      }}
    >
      {visible}
      {showCursor ? (
        <span style={{ color: colors.amber, marginLeft: 2 }}>_</span>
      ) : null}
    </div>
  );
};
