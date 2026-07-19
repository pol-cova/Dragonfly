import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, fonts } from "../lib/theme";

type Props = {
  image: string;
  url?: string;
  zoom?: number;
};

export const BrowserFrame: React.FC<Props> = ({
  image,
  url = "dragonfly.paulcontre.com",
  zoom = 1,
}) => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 300], [0, -8]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: `0 24px 80px rgba(0,0,0,0.55), 0 0 60px ${colors.fog}`,
        background: colors.panel,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((dot) => (
            <div
              key={dot}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: dot,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            fontFamily: fonts.mono,
            fontSize: 14,
            color: colors.fgDim,
            textAlign: "center",
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            transform: `scale(${zoom}) translateY(${pan}px)`,
            transformOrigin: "top center",
          }}
        />
      </div>
    </div>
  );
};
