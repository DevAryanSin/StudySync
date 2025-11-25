// app/group/quiz/page.tsx
import Link from "next/link";

const dummyQuizzes = [
  { id: "q1", title: "Stacks & Queues Basics", group: "DSA - 2nd Year CSE" },
  { id: "q2", title: "Normalization & Keys", group: "DBMS Night Owls" },
];

export default function QuizListPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-sm text-slate-600">
            Practice concepts and compete on group and campus leaderboards.
          </p>
        </div>

        <button className="rounded-md border bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          + Create Quiz
        </button>
      </header>

      <div className="space-y-3">
        {dummyQuizzes.map((q) => (
          <Link
            key={q.id}
            href={`/group/quiz/${q.id}`}
            className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition block"
          >
            <h2 className="font-semibold">{q.title}</h2>
            <p className="text-xs text-slate-600 mt-1">Group: {q.group}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
