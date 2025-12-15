"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import { Track } from "../../types";
import { load, save } from "../../lib/storage";

const STORAGE_KEY = "calmdesk_music_state";

const playlist: Track[] = [
  { id: "1", title: "Calm Breeze", artist: "Loft", url: "/audio/track1.mp3" },
  { id: "2", title: "Soft Morning", artist: "Sunrise", url: "/audio/track2.mp3" },
  { id: "3", title: "Focus Lines", artist: "Studio", url: "/audio/track3.mp3" },
];

type PlayerState = { index: number; volume: number; shuffle: boolean; loop: boolean };

export default function MusicPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({ index: 0, volume: 0.6, shuffle: false, loop: false });
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const saved = load<PlayerState>(STORAGE_KEY, state);
    setState(saved);
  }, []);

  useEffect(() => {
    save(STORAGE_KEY, state);
  }, [state]);

  const currentTrack = useMemo(() => playlist[state.index] ?? playlist[0], [state.index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    audio.currentTime = 0;
    if (playing) {
      audio.play();
    }
  }, [state.index, playing]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const setVolume = (value: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = value;
    setState((s) => ({ ...s, volume: value }));
  };

  const nextTrack = () => {
    setState((s) => {
      if (s.shuffle) {
        const next = Math.floor(Math.random() * playlist.length);
        return { ...s, index: next };
      }
      return { ...s, index: (s.index + 1) % playlist.length };
    });
  };

  const prevTrack = () => {
    setState((s) => ({ ...s, index: (s.index - 1 + playlist.length) % playlist.length }));
  };

  const handleEnded = () => {
    if (state.loop) {
      audioRef.current?.play();
      return;
    }
    nextTrack();
  };

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <PageHeader
        title="Music"
        actions={
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={state.shuffle}
                onChange={(e) => setState((s) => ({ ...s, shuffle: e.target.checked }))}
              />
              Shuffle
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={state.loop}
                onChange={(e) => setState((s) => ({ ...s, loop: e.target.checked }))}
              />
              Loop
            </label>
          </div>
        }
      />

      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Now playing</p>
            <h3 className="text-xl font-semibold text-slate-900">{currentTrack.title}</h3>
            <p className="text-slate-500">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={prevTrack}>
              Prev
            </Button>
            <Button onClick={togglePlay}>{playing ? "Pause" : "Play"}</Button>
            <Button variant="ghost" onClick={nextTrack}>
              Next
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={1}
            value={currentTime}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = value;
              }
              setCurrentTime(value);
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{Math.floor(currentTime)}s</span>
            <span>{Math.floor(duration)}s</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration || 0);
            e.currentTarget.volume = state.volume;
          }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onEnded={handleEnded}
          autoPlay={playing}
        />
      </Card>

      <Card title="Playlist">
        <div className="grid sm:grid-cols-2 gap-2">
          {playlist.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => setState((s) => ({ ...s, index: idx }))}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                state.index === idx ? "border-accent bg-indigo-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="font-semibold text-slate-900">{track.title}</div>
                <div className="text-xs text-slate-500">{track.artist}</div>
              </div>
              <span className="text-sm">{state.index === idx ? "Playing" : "Play"}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
