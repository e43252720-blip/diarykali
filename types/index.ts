export type Mood = "happy" | "calm" | "sad" | "angry" | "tired";

export type DiaryEntry = {
  id: string;
  date: string;
  mood: Mood;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
};
