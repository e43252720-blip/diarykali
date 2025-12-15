"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/diary", label: "Diary", icon: "📖" },
  { href: "/notes", label: "Notes", icon: "📝" },
  { href: "/game", label: "Game", icon: "🎈" },
  { href: "/music", label: "Music", icon: "🎧" },
];

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block bg-white border-r border-slate-200 p-6 space-y-6">
        <div>
          <div className="text-2xl font-semibold text-slate-900">CalmDesk</div>
          <p className="text-sm text-slate-500">Stay calm, create, and play.</p>
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition",
                pathname.startsWith(link.href)
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="bg-surface p-4 lg:p-8">
        <div className="container-max">{children}</div>
      </main>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around py-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-col items-center text-xs font-medium",
              pathname.startsWith(link.href) ? "text-accent" : "text-slate-500"
            )}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
