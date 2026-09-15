"use client";

import { useEffect, useRef, useState } from "react";
import type { MusicTrack } from "@/content";
import {
  DEFAULT_MUSIC_REACTIVE_STATE,
  MUSIC_REACTIVE_EVENT,
} from "@/lib/music-reactive-bridge.js";

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function MusicPlayer({ tracks }: { tracks: MusicTrack[] }) {
  const audio = useRef<HTMLAudioElement>(null);
  const context = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const playAfterChange = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const track = tracks[index];

  async function play() {
    const element = audio.current;
    if (!element) return;
    setError("");
    setExpanded(true);
    try {
      if (!context.current && typeof AudioContext !== "undefined") {
        context.current = new AudioContext();
        analyser.current = context.current.createAnalyser();
        analyser.current.fftSize = 256;
        analyser.current.smoothingTimeConstant = 0.75;
        const source = context.current.createMediaElementSource(element);
        source.connect(analyser.current);
        analyser.current.connect(context.current.destination);
      }
      if (context.current?.state === "suspended")
        await context.current.resume();
      await element.play();
    } catch {
      setError("Playback could not start. Press play to try again.");
    }
  }

  function selectTrack(next: number) {
    if (next === index) {
      void play();
      return;
    }
    playAfterChange.current = true;
    setElapsed(0);
    setDuration(0);
    setIndex(next);
  }

  useEffect(() => {
    if (playAfterChange.current) {
      playAfterChange.current = false;
      void play();
    }
    // The same audio node is retained so its MediaElementSource stays connected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    let frame = 0;
    const frequencies = new Uint8Array(128);
    let previousLow = 0;
    let previousMid = 0;
    function publish() {
      const node = analyser.current;
      let low = 0;
      let mid = 0;
      let high = 0;
      if (playing && node) {
        node.getByteFrequencyData(frequencies);
        const average = (start: number, end: number) => {
          let sum = 0;
          for (let i = start; i < end; i++) sum += frequencies[i];
          return sum / (end - start) / 255;
        };
        low = average(0, 10);
        mid = average(10, 55);
        high = average(55, 128);
      }
      window.dispatchEvent(
        new CustomEvent(MUSIC_REACTIVE_EVENT, {
          detail: {
            ...DEFAULT_MUSIC_REACTIVE_STATE,
            isPlaying: playing,
            isActive: playing,
            mode: track.reactiveMode,
            low,
            mid,
            high,
            lowPulse: Math.max(0, low - previousLow) * 5,
            midPulse: Math.max(0, mid - previousMid) * 4,
          },
        }),
      );
      previousLow = low;
      previousMid = mid;
      if (playing && document.visibilityState !== "hidden")
        frame = requestAnimationFrame(publish);
    }
    const refresh = () => {
      cancelAnimationFrame(frame);
      publish();
    };
    refresh();
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [playing, track.reactiveMode]);

  useEffect(
    () => () => {
      void context.current?.close();
      window.dispatchEvent(
        new CustomEvent(MUSIC_REACTIVE_EVENT, {
          detail: DEFAULT_MUSIC_REACTIVE_STATE,
        }),
      );
    },
    [],
  );

  return (
    <div className={`hero-music-player${expanded ? " is-expanded" : ""}`}>
      <audio
        ref={audio}
        src={track.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onEnded={() => selectTrack((index + 1) % tracks.length)}
        onError={() =>
          setError("This track could not be loaded. Please try another track.")
        }
      />
      <button
        className={`hero-music-toggle${playing ? " is-playing" : ""}`}
        aria-label={`${playing ? "Pause" : "Play"} ${track.title}`}
        onClick={() => (playing ? audio.current?.pause() : void play())}
      >
        <span
          className={playing ? "audio-pause-symbol" : "audio-play-symbol"}
          aria-hidden="true"
        />
      </button>
      <button
        className="hero-music-label-button"
        aria-expanded={expanded}
        aria-controls="music-details"
        onClick={() => (expanded ? setExpanded(false) : void play())}
      >
        {expanded ? track.title : "Press play"}
      </button>
      {expanded && (
        <div id="music-details" className="music-details">
          <p className="music-artist">{track.artist}</p>
          <label className="sr-only" htmlFor="music-seek">
            Seek within {track.title}
          </label>
          <input
            id="music-seek"
            className="music-seek"
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={Math.min(elapsed, duration || 1)}
            disabled={!duration}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (audio.current) audio.current.currentTime = next;
              setElapsed(next);
            }}
          />
          <div className="music-time">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="music-playlist" aria-label="Music tracks">
            {tracks.map((item, position) => (
              <button
                key={item.src}
                onClick={() => selectTrack(position)}
                aria-pressed={index === position}
              >
                <span>0{position + 1}</span>
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="music-error" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
