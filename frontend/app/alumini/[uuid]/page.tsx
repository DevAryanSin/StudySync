// app/alumini/[uuid]/page.tsx

interface AlumniPageProps {
    params: { uuid: string };
}

export default function AlumniDetailPage({ params }: AlumniPageProps) {
    const { uuid } = params;

  // Later: fetch mentor profile, expertise, sessions, resources from MongoDB
    return (
    <div className="space-y-4">
    <header>
        <h1 className="text-2xl font-bold">Mentor Profile: {uuid}</h1>
        <p className="text-sm text-slate-600">
        Details
        </p>
    </header>

    <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
        <div className="rounded-lg border bg-zinc-900 p-4 shadow-sm">
            <h2 className="font-semibold mb-1">About & Expertise</h2>
            <p className="text-sm text-slate-600">
            Detailed description of skills, subjects, and companies here.
            </p>
        </div>

        <div className="rounded-lg border bg-zinc-900 p-4 shadow-sm">
            <h2 className="font-semibold mb-1">Resources & Notes</h2>
            <p className="text-sm text-slate-600">
            Link Supabase-stored PDFs, notes, and mentor-created quizzes.
            </p>
        </div>
        </div>

        <div className="space-y-3">
        <div className="rounded-lg border bg-zinc-900 p-4 shadow-sm">
            <h3 className="font-semibold mb-1">Request Guidance</h3>
            <p className="text-sm text-slate-600 mb-2">
            Add a small form or button to schedule a session or send a
            question.
            </p>
            <button className="rounded-md border bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Request Session
            </button>
        </div>
        </div>
    </section>
    </div>
);
}
