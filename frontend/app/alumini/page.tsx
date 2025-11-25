// app/alumini/page.tsx
import Link from "next/link";

const dummyMentors = [
  { id: "m1", name: "Rahul Sharma", focus: "DSA, Product Based Placements" },
  { id: "m2", name: "Ananya Gupta", focus: "DBMS, Backend Internships" },
];

export default function AlumniListPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seniors & Alumni Mentors</h1>
          <p className="text-sm text-slate-600">
            Get structured guidance on subjects, internships, placements, and
            higher studies.
          </p>
        </div>

        <button className="rounded-lg  border-blue-900 bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Become a Mentor
        </button>
      </header>

      <div className="space-y-3">
        {dummyMentors.map((m) => (
          <Link
            key={m.id}
            href={`/alumini/${m.id}`}
            className="rounded-lg border bg-zinc-900 p-4 shadow-sm hover:shadow-md transition block"
          >
            <h2 className="font-semibold">{m.name}</h2>
            <p className="text-xs text-slate-600 mt-1">{m.focus}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
