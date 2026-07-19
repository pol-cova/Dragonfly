import { AbsoluteFill, Series, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { CloseScene } from "./scenes/CloseScene";
import { HookScene } from "./scenes/HookScene";
import { IntroScene } from "./scenes/IntroScene";
import { PrivacyScene } from "./scenes/PrivacyScene";
import { ProductDemoScene } from "./scenes/ProductDemoScene";
import { WingScene } from "./scenes/WingScene";
import { copy } from "./lib/copy";
import { sceneDurations } from "./lib/theme";

export const DragonflyPitch: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030806" }}>
      <Audio src={staticFile(copy.intro.voiceFile)} volume={1} />

      <Series>
        <Series.Sequence
          durationInFrames={sceneDurations.intro}
          premountFor={30}
        >
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={sceneDurations.hook} premountFor={30}>
          <HookScene />
        </Series.Sequence>
        <Series.Sequence
          durationInFrames={sceneDurations.productDemo}
          premountFor={30}
        >
          <ProductDemoScene />
        </Series.Sequence>
        <Series.Sequence
          durationInFrames={sceneDurations.privacy}
          premountFor={30}
        >
          <PrivacyScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={sceneDurations.wing} premountFor={30}>
          <WingScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={sceneDurations.close} premountFor={30}>
          <CloseScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
