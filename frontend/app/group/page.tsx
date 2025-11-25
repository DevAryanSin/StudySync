// app/group/page.tsx
import Link from "next/link";

const dummyGroups = [
  { id: "123", name: "DSA - 2nd Year CSE", subject: "Data Structures", members: 18 },
  { id: "234", name: "DBMS Night Owls", subject: "DBMS", members: 10 },
];

export default function GroupListPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Study Groups</h1>
          <p className="text-sm text-slate-600 mt-1">
            Join a group to collaborate and learn together.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
          + Create Group
        </button>
      </header>

      <div className="space-y-3">
        {dummyGroups.map((g) => (
          <Link
            key={g.id}
            href={`/group/${g.id}`}
            className="block p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md hover:border-blue-300 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">{g.name}</h2>
                <p className="text-xs text-slate-600 mt-1">{g.subject}</p>
              </div>
              <p className="text-xs font-medium text-slate-500">{g.members} members</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
