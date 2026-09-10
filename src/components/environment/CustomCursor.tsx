import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, summary, label, [role="button"], [data-cursor]';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const mutedRef = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("exclade-click-sound-muted") === "true";
    mutedRef.current = saved;
  }, []);

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(pointer.matches);
    update();
    pointer.addEventListener("change", update);
    return () => pointer.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const target = { x: -40, y: -40 };
    const position = { x: -40, y: -40 };
    let frame = 0;
    let pressedTimer = 0;
    let visible = false;
    let audioContext: AudioContext | null = null;
    let noiseBuffer: AudioBuffer | null = null;
    const activeSources: AudioScheduledSourceNode[] = [];

    const playImpact = () => {
      if (mutedRef.current) return;
      const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextConstructor) return;
      audioContext ??= new AudioContextConstructor();
      void audioContext.resume();
      const context = audioContext;
      noiseBuffer ??= context.createBuffer(1, Math.ceil(context.sampleRate * 0.12), context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let index = 0; index < noiseData.length; index += 1) noiseData[index] = Math.random() * 2 - 1;

      const now = context.currentTime;
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      gain.connect(context.destination);

      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1900;
      filter.Q.value = 0.7;
      filter.connect(gain);

      const noise = context.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.connect(filter);
      noise.start(now);
      noise.stop(now + 0.12);

      const tone = context.createOscillator();
      const toneGain = context.createGain();
      tone.type = "triangle";
      tone.frequency.setValueAtTime(125, now);
      tone.frequency.exponentialRampToValueAtTime(70, now + 0.1);
      toneGain.gain.setValueAtTime(0.08, now);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      tone.connect(toneGain).connect(gain);
      tone.start(now);
      tone.stop(now + 0.11);

      activeSources.push(noise, tone);
      while (activeSources.length > 4) activeSources.shift()?.stop();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        position.x = target.x;
        position.y = target.y;
        visible = true;
        cursor.classList.add("is-visible");
      }
      cursor.classList.toggle("is-hover", Boolean((event.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR)));
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!(event.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR)) return;
      cursor.classList.remove("is-pressed");
      void cursor.offsetWidth;
      cursor.classList.add("is-pressed");
      playImpact();
      window.clearTimeout(pressedTimer);
      pressedTimer = window.setTimeout(() => cursor.classList.remove("is-pressed"), 260);
    };

    const onLeave = () => {
      visible = false;
      cursor.classList.remove("is-visible", "is-hover");
    };

    const tick = () => {
      position.x += (target.x - position.x) * 0.34;
      position.y += (target.y - position.y) * 0.34;
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      frame = window.requestAnimationFrame(tick);
    };

    document.body.classList.add("has-reticle-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(pressedTimer);
      activeSources.splice(0).forEach((source) => {
        try { source.stop(); } catch { /* already stopped */ }
      });
      audioContext?.close();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.body.classList.remove("has-reticle-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="reticle-cursor" aria-hidden="true">
      <span className="reticle-ring" />
      <span className="reticle-mark reticle-mark-top" />
      <span className="reticle-mark reticle-mark-right" />
      <span className="reticle-mark reticle-mark-bottom" />
      <span className="reticle-mark reticle-mark-left" />
      <span className="reticle-core" />
      <span className="reticle-ripple" />
    </div>
  );
}
