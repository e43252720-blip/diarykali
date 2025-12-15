import Link from "next/link";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-50 to-slate-100 rounded-2xl p-6 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Welcome to CalmDesk</h1>
        <p className="text-slate-600 mb-4">
          A calm space to write diaries, take quick notes, play a focus mini game, and listen to music.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/diary">
            <Button>Go to Diary</Button>
          </Link>
          <Link href="/notes">
            <Button variant="ghost">Go to Notes</Button>
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Diary & Mood">
          <p className="text-sm text-slate-600">
            Track your days with moods, filter entries, and keep memories tidy.
          </p>
        </Card>
        <Card title="Notes & Tags">
          <p className="text-sm text-slate-600">Capture quick thoughts with tags and search instantly.</p>
        </Card>
        <Card title="Bubble Pop Focus">
          <p className="text-sm text-slate-600">Take a short break—pop bubbles and chase a new high score.</p>
        </Card>
        <Card title="Music Player">
          <p className="text-sm text-slate-600">Play calming tracks with shuffle, loop, and volume control.</p>
        </Card>
      </div>
    </div>
  );
}
