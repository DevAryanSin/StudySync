// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudySync",
  description: "Peer study groups, mentorship, and quizzes in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 shadow-2xl rounded-2xl">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/home" className="font-bold text-xl text-black">
              Study<span className="text-blue-600">Sync</span>
            </Link>

            <div className="flex items-center gap-4 text-sm text-black font-medium ">
              <Link href="/home">Home</Link>
              <Link href="/group">Groups</Link>
              <Link href="/alumini">Seniors</Link>
              <Link href="/group/quiz">Login</Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
