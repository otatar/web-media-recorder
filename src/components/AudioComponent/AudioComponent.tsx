import { useEffect, useRef, useState } from "react";
import ErrorAlert from "@components/ErrorAlert";
import { getMedia } from "@utils/getMedia";
import useTimer from "@hooks/useTimer";
import { secToHMS } from "@utils/secToTime";
const BUTTON_TAILWIND =
  "px-4 py-2 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-blue-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white disabled:text-gray-200";

function AudioComponent() {
  const [permision, setPermision] = useState(false);
  const [userMedia, setUserMedia] = useState<MediaStream>();
  const [error, setError] = useState<string>();
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>();
  const [audio, setAudio] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [startTimeRec, setStartTimeRec] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.onplay = () => {
        const stream = (audioPlayerRef.current as any).captureStream();
        startVisulizer(stream);
      };
      audioPlayerRef.current.onended = () => {
        stopVisulizer();
      };
    }
  }, [audio]);

  const recTime = useTimer(startTimeRec);

  const getMicrophone = async () => {
    const constraints = { audio: true };
    const [media, error] = await getMedia(constraints);
    if (media) {
      setUserMedia(media);
      setPermision(true);
      setError(null);
    }
    if (error) setError(error);
  };

  const record = () => {
    console.log("Recording...");
    setRecording(true);
    setStartTimeRec(Date.now());
    if (userMedia) {
      const recorder = new MediaRecorder(userMedia, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      //Visalizer
      startVisulizer(userMedia);
    }

    mediaRecorderRef.current?.start();
    let localAudioChunks: Blob[] = [];

    mediaRecorderRef.current!.ondataavailable = (ev: BlobEvent) => {
      if (ev.data.size === 0) return;
      localAudioChunks.push(ev.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const stop = () => {
    console.log("Stop rec");
    setRecording(false);
    setStartTimeRec(0);
    stopVisulizer();
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current!.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
    };
  };

  const startVisulizer = (mediaStream: MediaStream) => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const audioSrc = audioCtx.createMediaStreamSource(mediaStream);
    audioSrc.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const loopingFunction = () => {
      animationRef.current = requestAnimationFrame(loopingFunction);
      analyser.getByteTimeDomainData(data);
      draw(data);
    };
    requestAnimationFrame(loopingFunction);
  };

  const stopVisulizer = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      cancelAnimationFrame(animationRef.current);
    }
  };

  const draw = (dataParm: Uint8Array) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const step = ctx.canvas.width / dataParm.length;
      ctx.beginPath();

      //drawing loop
      for (let i = 0; i < dataParm.length; i++) {
        const percent = dataParm[i] / 256;
        const x = 0 + i * step;
        const y = 0 + ctx.canvas.height * percent;
        ctx.lineTo(x, y);
      }
      const gr = ctx.createLinearGradient(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
      gr.addColorStop(0, "#059669");
      gr.addColorStop(1, "#1d4ed8");
      ctx.strokeStyle = gr;
      ctx.stroke();
    }
  };

  return (
    <div className="my-3 flex flex-col items-center gap-2">
      <h1 className="mb-4 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-blue-700">
        Audio Recorder
      </h1>
      <canvas
        id="audioCanvas"
        ref={canvasRef}
        width="320"
        height="240"
        className="border"
      />
      {!permision ? (
        <button
          onClick={getMicrophone}
          type="button"
          className={BUTTON_TAILWIND}
        >
          Get Microphone
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
      {audio ? (
        <div className="my-2">
          <audio src={audio} ref={audioPlayerRef} controls></audio>
        </div>
      ) : null}
      {error ? <ErrorAlert msg={error} /> : null}
    </div>
  );
}

export default AudioComponent;
