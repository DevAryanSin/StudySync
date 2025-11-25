// app/group/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import CreateGroupModal from "@/components/CreateGroupModal";

interface Group {
  id: string;
  name: string;
  subject: string;
  members: number;
}

const initialGroups: Group[] = [
  { id: "123", name: "DSA - 2nd Year CSE", subject: "Data Structures", members: 18 },
  { id: "234", name: "DBMS Night Owls", subject: "DBMS", members: 10 },
];

export default function GroupListPage() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateGroupId = (): string => {
    // Generate unique 3-digit ID following the pattern (123, 234, etc.)
    if (groups.length === 0) return "123";
    const maxId = Math.max(...groups.map((g) => parseInt(g.id)));
    return String(maxId + 1).padStart(3, "0");
  };

  const handleCreateGroup = (groupData: {
    name: string;
    subject: string;
    members?: number;
  }) => {
    const newGroup: Group = {
      id: generateGroupId(),
      name: groupData.name,
      subject: groupData.subject,
      members: groupData.members || 1,
    };

    setGroups([...groups, newGroup]);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Study Groups</h1>
          <p className="text-sm text-slate-600 mt-1">
            Join a group to collaborate and learn together.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          + Create Group
        </button>
      </header>

      <div className="space-y-3">
        {groups.map((g) => (
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
            </div>
          </Link>
        ))}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}
