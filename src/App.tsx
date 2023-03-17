import { useState } from "react";
import MainAVToggle from "@components/MainAVToggle";
import AudioComponent from "@components/AudioComponent/AudioComponent";
import VideoComponent from "@components/VideoComponent/VideoComponent";

function App() {
  const [recorderType, setRecorderType] = useState<string>("audio");
  return (
    <div className="h-full flex flex-col m-3 items-center justify-center">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-blue-700">
          Web media
        </span>{" "}
        Recorder
      </h1>
      <MainAVToggle buttonClicked={(v: string) => setRecorderType(v)} />
      {recorderType == "audio" ? (
        <AudioComponent />
      ) : recorderType == "video" ? (
        <VideoComponent />
      ) : null}
    </div>
  );
}

export default App;
