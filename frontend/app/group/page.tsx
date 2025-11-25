// app/group/page.tsx
import Link from "next/link";

const dummyGroups = [
  { id: "123", name: "DSA - 2nd Year CSE", subject: "Data Structures", members: 18 },
  { id: "234", name: "DBMS Night Owls", subject: "DBMS", members: 10 },
];

export default function GroupListPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-sm text-slate-600">
             Join or create groups.
          </p>
        </div>

        <button className="rounded-md border bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          + Create Group
        </button>
      </header>

      <div className="space-y-3">
        {dummyGroups.map((g) => (
          <Link
            key={g.id}
            href={`/group/${g.id}`}
            className="flex items-center justify-between rounded-lg border bg-black p-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <h2 className="font-semibold">{g.name}</h2>
              <p className="text-xs text-slate-600">{g.subject}</p>
            </div>
            <p className="text-xs text-slate-500">{g.members} members</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
