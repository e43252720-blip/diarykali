"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";
import { load, save } from "../../lib/storage";

const STORAGE_KEY = "calmdesk_highscore";

type Bubble = { id: string; left: number; top: number; size: number };

export default function GamePage() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHighScore(load<number>(STORAGE_KEY, 0));
  }, []);

  useEffect(() => {
    if (!running) return;

    spawnRef.current = setInterval(() => {
      const bubble: Bubble = {
        id: crypto.randomUUID(),
        left: Math.random() * 90,
        top: Math.random() * 70,
        size: 50 + Math.random() * 50,
      };
      setBubbles((prev) => [...prev, bubble]);
    }, Math.max(500, 1500 - score * 10));

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, score]);

  const popBubble = (id: string) => {
    if (!running) return;
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
    setRunning(true);
  };

  const stopGame = () => {
    setRunning(false);
    setBubbles([]);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setHighScore((prev) => {
      const best = Math.max(prev, score);
      save(STORAGE_KEY, best);
      return best;
    });
  };

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <PageHeader
        title="Bubble Pop Focus"
        onNew={running ? stopGame : startGame}
        actions={<div className="text-sm text-slate-600">High score: {highScore}</div>}
      />

      <Card>
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Time: {timeLeft}s</div>
        </div>
        <div className="relative h-[400px] bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl overflow-hidden">
          {!running && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3">
              <p>Press Start to begin popping bubbles.</p>
              <Button onClick={startGame}>Start</Button>
            </div>
          )}
          {bubbles.map((b) => (
            <button
              key={b.id}
              onClick={() => popBubble(b.id)}
              className="absolute bg-white text-accent font-semibold rounded-full shadow-soft flex items-center justify-center transition transform hover:scale-110"
              style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size }}
            >
              🎈
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
