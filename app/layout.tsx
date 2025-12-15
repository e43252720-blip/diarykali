import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "../components/LayoutShell";

export const metadata: Metadata = {
  title: "CalmDesk",
  description: "Diary, notes, mini game, and music in one calm dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
