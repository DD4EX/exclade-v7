import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import introTrack from "@/assets/tuco-tight-intro.mpeg.asset.json";

type CinematicLoaderProps = {
  onSkip: () => void;
};

export function CinematicLoader({ onSkip }: CinematicLoaderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;
    audio.loop = false;
    let cancelled = false;

    const startOnce = () => {
      if (cancelled || !audio.paused || audio.ended) return;
      audio.play().then(() => {
        setPlaying(true);
        setNeedsTap(false);
      }).catch(() => setNeedsTap(true));
    };

    const onEnded = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    startOnce();
    window.addEventListener("pointerdown", startOnce, { once: true });
    window.addEventListener("keydown", startOnce, { once: true });

    return () => {
      cancelled = true;
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", onEnded);
      window.removeEventListener("pointerdown", startOnce);
      window.removeEventListener("keydown", startOnce);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <div className="loader-screen" role="dialog" aria-label="EXCLADE 2K26 introduction">
      <audio ref={audioRef} src={introTrack.url} preload="auto" aria-hidden="true" />
      <div className="loader-noise" aria-hidden="true" />
      <div className="loader-dust loader-dust-one" aria-hidden="true" />
      <div className="loader-dust loader-dust-two" aria-hidden="true" />
      <div className="loader-content">
        <div className="loader-mark">E</div>
        <p className="loader-line loader-line-one">KSR COLLEGE OF ENGINEERING</p>
        <p className="loader-line loader-line-two">DEPARTMENT OF CSE (IoT)</p>
        <div className="loader-title">
          <span>EXCLADE</span>
          <span>2K26</span>
        </div>
        <p className="loader-caption">THE SYMPOSIUM BEGINS</p>
        <div className="loader-actions">
          <button type="button" className="loader-audio" onClick={toggleMute} aria-pressed={muted}>
            {muted ? <VolumeX aria-hidden="true" size={14} /> : <Volume2 aria-hidden="true" size={14} />}
            {needsTap ? "ENABLE SOUND" : playing && !muted ? "SOUND ON" : "SOUND OFF"}
          </button>
          <button type="button" className="loader-skip" onClick={onSkip}>
            Skip intro <ArrowRight aria-hidden="true" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}