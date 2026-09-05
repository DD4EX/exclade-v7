import { Music, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import introTrack from "@/assets/tuco-tight-intro.mpeg.asset.json";

export function IntroMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;

    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setNeedsTap(false);
        })
        .catch(() => setNeedsTap(true));
    };

    start();

    const onFirstGesture = () => start();
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        setPlaying(true);
        setNeedsTap(false);
      }).catch(() => setNeedsTap(true));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={introTrack.url} loop preload="auto" />
      <button
        type="button"
        className={playing ? "theme-toggle is-playing" : "theme-toggle"}
        onClick={toggle}
        aria-label={playing ? "Mute the theme music" : "Play the theme music"}
      >
        <span className="theme-toggle-icon" aria-hidden="true">
          {playing ? <Volume2 size={16} /> : needsTap ? <Music size={16} /> : <VolumeX size={16} />}
        </span>
        <span className="theme-toggle-label">{playing ? "TIGHT · TIGHT · TIGHT" : "PLAY THEME"}</span>
        <span className="theme-eq" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      </button>
    </>
  );
}
