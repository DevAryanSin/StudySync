// app/home/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">
          Welcome to StudySync
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Collaborate with peers in study groups and get instant help from our AI chatbot.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Link
          href="/group"
          className="group block rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
        >
          <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-slate-900">Study Groups</h2>
          <p className="text-slate-600">
            Join study groups to collaborate with peers and share learning resources.
          </p>
        </Link>

        <Link
          href="/group"
          className="group block rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300"
        >
          <div className="mb-4 inline-block rounded-lg bg-green-100 p-3 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-slate-900">AI Chatbot</h2>
          <p className="text-slate-600">
            Upload files and chat with our AI assistant to get instant answers.
          </p>
        </Link>
      </section>
    </div>
  );
}
