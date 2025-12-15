"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Label, Input, TextArea } from "../../components/Field";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { DiaryEntry, Mood } from "../../types";
import { generateId } from "../../lib/id";
import { load, save } from "../../lib/storage";

const moodOptions: { value: Mood; label: string; emoji: string }[] = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "sad", label: "Sad", emoji: "😔" },
  { value: "angry", label: "Angry", emoji: "😤" },
  { value: "tired", label: "Tired", emoji: "🥱" },
];

const STORAGE_KEY = "calmdesk_diary";

type FormState = Omit<DiaryEntry, "id" | "createdAt" | "updatedAt">;

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DiaryEntry | null>(null);
  const [form, setForm] = useState<FormState>({
    date: new Date().toISOString().slice(0, 10),
    mood: "calm",
    title: "",
    content: "",
  });

  useEffect(() => {
    const data = load<DiaryEntry[]>(STORAGE_KEY, []);
    setEntries(data);
  }, []);

  useEffect(() => {
    save(STORAGE_KEY, entries);
  }, [entries]);

  const filtered = useMemo(() => {
    return entries
      .filter((entry) =>
        `${entry.title} ${entry.content}`.toLowerCase().includes(search.toLowerCase())
      )
      .filter((entry) => (moodFilter === "all" ? true : entry.mood === moodFilter))
      .sort((a, b) => (sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [entries, search, moodFilter, sort]);

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().slice(0, 10),
      mood: "calm",
      title: "",
      content: "",
    });
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setEntries((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, ...form, updatedAt: Date.now() } : item
        )
      );
    } else {
      const entry: DiaryEntry = {
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...form,
      };
      setEntries((prev) => [entry, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this entry?")) return;
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const startEdit = (entry: DiaryEntry) => {
    setEditing(entry);
    setForm({ date: entry.date, mood: entry.mood, title: entry.title, content: entry.content });
    setModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <PageHeader title="Diary" onNew={openNew} />
      <Card className="space-y-3">
        <div className="grid md:grid-cols-4 gap-3">
          <Input
            placeholder="Search title or content"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2"
          />
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value as Mood | "all")}
          >
            <option value="all">All moods</option>
            {moodOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.emoji} {m.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-sm">No entries yet. Tap New to start a diary.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((entry) => (
            <Card
              key={entry.id}
              title={`${entry.mood} · ${new Date(entry.date).toLocaleDateString()}`}
              actions={
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => startEdit(entry)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </Button>
                </div>
              }
            >
              <h4 className="text-lg font-semibold text-slate-900 mb-1">{entry.title}</h4>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{entry.content}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal title={editing ? "Edit entry" : "New entry"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label text="Date" htmlFor="date" />
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <Label text="Mood" />
              <div className="flex gap-2 flex-wrap">
                {moodOptions.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setForm((f) => ({ ...f, mood: m.value }))}
                    className={`flex-1 min-w-[70px] px-3 py-2 rounded-xl border text-sm transition ${
                      form.mood === m.value
                        ? "border-accent bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="mr-1">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label text="Title" htmlFor="title" />
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Today was calm..."
            />
          </div>
          <div>
            <Label text="Content" htmlFor="content" />
            <TextArea
              id="content"
              rows={5}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your thoughts"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
