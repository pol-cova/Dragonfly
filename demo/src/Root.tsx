import "./index.css";
import { Composition } from "remotion";
import { DragonflyPitch } from "./DragonflyPitch";
import "./lib/fonts";
import { FPS, HEIGHT, TOTAL_DURATION_FRAMES, WIDTH } from "./lib/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DragonflyPitch"
        component={DragonflyPitch}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
