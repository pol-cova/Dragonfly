import {
  AbsoluteFill,
  interpolate,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { KineticLine } from "../components/KineticLine";
import { SignalBg } from "../components/SignalBg";
import { copy } from "../lib/copy";
import { displayFont } from "../lib/fonts";
import { colors, fonts, sceneDurations } from "../lib/theme";

const SLIDE_FRAMES = Math.floor(
  sceneDurations.productDemo / copy.productDemo.slides.length,
);

type SlideProps = {
  image: string;
  caption: string;
  label: string;
  zoom?: number;
};

const ProductSlide: React.FC<SlideProps> = ({
  image,
  caption,
  label,
  zoom = 1.08,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 90 },
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const slideY = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${slideY}px)` }}>
      <AbsoluteFill
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: 48,
          padding: "100px 80px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 16,
          }}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 20,
              color: colors.amber,
              letterSpacing: "0.16em",
              marginBottom: 20,
            }}
          >
            {label}
          </div>
          <KineticLine
            text={caption}
            delay={8}
            size={36}
            color={colors.fgBright}
            align="left"
          />
        </div>

        <div style={{ minHeight: 0, height: "100%" }}>
          <BrowserFrame image={image} url={copy.liveUrl} zoom={zoom} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          top: 48,
          left: 80,
          right: undefined,
          bottom: undefined,
          width: "auto",
          height: "auto",
        }}
      >
        <div
          style={{
            fontFamily: displayFont.fontFamily,
            fontSize: 28,
            color: colors.fgDim,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {copy.productDemo.headline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ProductDemoScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <SignalBg pulse={false} />
      <Series>
        {copy.productDemo.slides.map((slide, index) => (
          <Series.Sequence
            key={slide.image}
            durationInFrames={SLIDE_FRAMES}
            premountFor={30}
          >
            <ProductSlide
              image={slide.image}
              caption={slide.caption}
              label={slide.label}
              zoom={index === 0 ? 1.12 : 1.06}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
