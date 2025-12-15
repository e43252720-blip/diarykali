"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input, Label, TextArea } from "../../components/Field";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { Note } from "../../types";
import { generateId } from "../../lib/id";
import { load, save } from "../../lib/storage";

const STORAGE_KEY = "calmdesk_notes";

type FormState = Omit<Note, "id" | "createdAt" | "updatedAt">;

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState<FormState>({ title: "", content: "", tags: [] });
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");

  useEffect(() => {
    setNotes(load<Note[]>(STORAGE_KEY, []));
  }, []);

  useEffect(() => {
    save(STORAGE_KEY, notes);
  }, [notes]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [notes]);

  const filtered = useMemo(() => {
    return notes
      .filter((n) => `${n.title} ${n.content}`.toLowerCase().includes(search.toLowerCase()))
      .filter((n) => (tagFilter === "all" ? true : n.tags.includes(tagFilter)))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, search, tagFilter]);

  const resetForm = () => {
    setForm({ title: "", content: "", tags: [] });
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    setModalOpen(true);
  };

  const toggleTag = (tag: string) => {
    setForm((f) => {
      const exists = f.tags.includes(tag);
      const tags = exists ? f.tags.filter((t) => t !== tag) : [...f.tags, tag];
      return { ...f, tags };
    });
  };

  const handleSubmit = () => {
    if (!form.title.trim() && !form.content.trim()) return;
    if (editing) {
      setNotes((prev) =>
        prev.map((n) => (n.id === editing.id ? { ...n, ...form, updatedAt: Date.now() } : n))
      );
    } else {
      const note: Note = {
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...form,
      };
      setNotes((prev) => [note, ...prev]);
    }
    setModalOpen(false);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this note?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <PageHeader
        title="Notes"
        onNew={openNew}
        actions={
          <Input
            placeholder="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52"
          />
        }
      />

      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={tagFilter === "all" ? "primary" : "ghost"}
          onClick={() => setTagFilter("all")}
          className="text-xs px-3 py-1"
        >
          All
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={tagFilter === tag ? "primary" : "ghost"}
            onClick={() => setTagFilter(tag)}
            className="text-xs px-3 py-1"
          >
            #{tag}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-sm">No notes yet. Add a quick note.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl shadow-soft p-4 border border-slate-100 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{note.title || "Untitled"}</h3>
                  <p className="text-xs text-slate-500">
                    {new Date(note.updatedAt).toLocaleDateString()} · {note.tags.map((t) => `#${t}`).join(" ")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditing(note);
                      setForm({ title: note.title, content: note.content, tags: note.tags });
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => remove(note.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap flex-1">{note.content}</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-indigo-50 text-accent px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal title={editing ? "Edit note" : "New note"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-3">
          <div>
            <Label text="Title" />
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Quick title"
            />
          </div>
          <div>
            <Label text="Content" />
            <TextArea
              rows={4}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your note"
            />
          </div>
          <div>
            <Label text="Tags (comma separated)" />
            <Input
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm((f) => ({ ...f, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))
              }
              placeholder="work, idea"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
                >
                  remove #{tag}
                </button>
              ))}
            </div>
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
