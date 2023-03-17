import ErrorAlert from "@components/ErrorAlert";
import useTimer from "@hooks/useTimer";
import { getMedia } from "@utils/getMedia";
import { secToHMS } from "@utils/secToTime";
import { useRef, useState } from "react";

const BUTTON_TAILWIND =
  "px-4 py-2 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-blue-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white disabled:text-gray-200";

const mimeType = 'video/webm; codecs="opus,vp8"';

function VideoComponent() {
  const [permision, setPermision] = useState(false);
  const [userMedia, setUserMedia] = useState<MediaStream>();
  const [error, setError] = useState<string>();
  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>();
  const [video, setVideo] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [startTimeRec, setStartTimeRec] = useState(0);

  const recTime = useTimer(startTimeRec);

  const getCamera = async () => {
    if (video) setVideo(undefined);
    const constraints = { audio: true, video: true };
    const [media, error] = await getMedia(constraints);
    if (media) {
      setUserMedia(media);
      setPermision(true);
      if (videoRef.current) {
        videoRef.current.src = "";
        videoRef.current.srcObject = media;
      }
    }
    if (error) setError(error);
  };

  const record = () => {
    console.log("Recording...");
    setRecording(true);
    setStartTimeRec(Date.now());
    if (userMedia) {
      const recorder = new MediaRecorder(userMedia, { mimeType });
      mediaRecorderRef.current = recorder;
    }

    mediaRecorderRef.current?.start();
    let localVideoChunks: Blob[] = [];

    mediaRecorderRef.current!.ondataavailable = (ev: BlobEvent) => {
      if (ev.data.size === 0) return;
      localVideoChunks.push(ev.data);
    };

    setVideoChunks(localVideoChunks);
  };

  const stop = () => {
    console.log("Stop rec");
    setRecording(false);
    setStartTimeRec(0);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current!.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideo(videoUrl);
      setVideoChunks([]);
      if (videoRef.current) videoRef.current.srcObject = null;
      setPermision(false);
    };
  };

  return (
    <div className="my-3 flex flex-col items-center gap-2">
      <h1 className="mb-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-blue-700">
        Video Recorder
      </h1>
      {!video ? (
        <video
          ref={videoRef}
          autoPlay
          style={{ width: 320, height: 240 }}
          className="border"
        />
      ) : (
        <video
          controls
          src={video}
          style={{ width: 320, height: 240 }}
          className="border"
        />
      )}
      {!permision ? (
        <button onClick={getCamera} type="button" className={BUTTON_TAILWIND}>
          Get Camera
        </button>
      ) : null}
      {permision && recording ? (
        <>
          <p className="font-mono text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-blue-700">
            {secToHMS(recTime)}
          </p>
          <div className="inline-flex gap-1">
            <button
              onClick={record}
              disabled
              type="button"
              className={BUTTON_TAILWIND}
            >
              Recording...
            </button>
            <button onClick={stop} type="button" className={BUTTON_TAILWIND}>
              Stop
            </button>
          </div>
        </>
      ) : null}
      {permision && !recording ? (
        <button onClick={record} type="button" className={BUTTON_TAILWIND}>
          Record
        </button>
      ) : null}
      {error ? <ErrorAlert msg={error} /> : null}
    </div>
  );
}

export default VideoComponent;
