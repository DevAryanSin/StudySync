// app/home/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-10">
        <h1 className="text-5xl font-extrabold mb-4 text-white">
          Welcome to StudySync
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Find study groups, connect with seniors, and practice quizzes to enhance your learning journey.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/group"
          className="group block rounded-xl border border-gray-200 bg-white/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300"
        >
          <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">Study Groups</h2>
          <p className="text-slate-600 leading-relaxed">
            Join study groups with like-minded students to collaborate and learn together.
          </p>
        </Link>

        <Link
          href="/alumini"
          className="group block rounded-xl border border-gray-200 bg-white/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300"
        >
          <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 0 6-3 6-7" /></svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-purple-600 transition-colors">Senior & Alumni Mentors</h2>
          <p className="text-slate-600 leading-relaxed">
            Get valuable guidance and mentorship from experienced seniors and alumni.
          </p>
        </Link>

        <Link
          href="/group/quiz"
          className="group block rounded-xl border border-gray-200 bg-white/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300"
        >
          <div className="mb-4 inline-block rounded-lg bg-emerald-100 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 1 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-emerald-600 transition-colors">Quizzes & Leaderboards</h2>
          <p className="text-slate-600 leading-relaxed">
            Practice concepts, compete with friends, and track your progress on the leaderboard.
          </p>
        </Link>


        <Link
          href="/group/quiz"
          className="group block rounded-xl border border-gray-200 bg-white/60 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300"
        >
          <div className="mb-4 inline-block rounded-lg bg-emerald-100 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 1 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-emerald-600 transition-colors">Quizzes & Leaderboards</h2>
          <p className="text-slate-600 leading-relaxed">
            Practice concepts, compete with friends, and track your progress on the leaderboard.
          </p>
        </Link>
        
      </section>
    </div>
  );
}
