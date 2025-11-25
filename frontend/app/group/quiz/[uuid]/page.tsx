// app/group/quiz/[uuid]/page.tsx

interface QuizPageProps {
  params: { uuid: string };
}

export default function QuizDetailPage({ params }: QuizPageProps) {
  const { uuid } = params;

  // Later: fetch quiz, questions, leaderboard from MongoDB
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Quiz: {uuid}</h1>
        <p className="text-sm text-slate-600">
          MCQ / True-False / Fill-in-the-Blank questions generated from notes.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Questions</h2>
          <p className="text-sm text-slate-600 mb-3">
            Render the quiz questions and options here.
          </p>

          <button className="rounded-md border bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Submit Quiz
          </button>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Leaderboard</h2>
          <p className="text-sm text-slate-600">
            Show rank, score, and time taken for group members.
          </p>
        </div>
      </section>
    </div>
  );
}
