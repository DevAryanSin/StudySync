"use client";

import { useState, use } from "react";
import Link from "next/link";

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadStatus("Uploading...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("group_id", id);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://studysync-136760819044.us-central1.run.app";
            console.log("📤 DEBUG: Uploading file to:", `${apiUrl}/upload`);
            console.log("📄 DEBUG: File:", file.name, "Group:", id);

            const res = await fetch(`${apiUrl}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            console.log("✅ DEBUG: Upload response:", data);

            if (res.ok) {
                setUploadStatus(`Upload successful! File saved to ${data.gcs_path}`);
                setFile(null);
            } else {
                setUploadStatus(`Upload failed: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("❌ DEBUG: Upload error:", error);
            setUploadStatus("Error uploading file. Is the backend running?");
        }
    };

    const handleChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const newMessages = [...messages, { role: "user" as const, content: query }];
        setMessages(newMessages);
        setQuery("");
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://studysync-136760819044.us-central1.run.app";
            console.log("🔍 DEBUG: Sending chat request to:", `${apiUrl}/chat`);
            console.log("📦 DEBUG: Request body:", { query, group_id: id });

            const res = await fetch(`${apiUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, group_id: id }),
            });

            console.log("📡 DEBUG: Response status:", res.status);
            const data = await res.json();
            console.log("✅ DEBUG: Response data:", data);

            if (data.answer) {
                setMessages([...newMessages, { role: "bot", content: data.answer }]);
            } else {
                setMessages([...newMessages, { role: "bot", content: "Sorry, I couldn't generate a response. Please try again." }]);
            }
        } catch (error) {
            console.error("❌ DEBUG: Chat error:", error);
            setMessages([...newMessages, {
                role: "bot",
                content: "⚠️ Cannot connect to chatbot server. Make sure the backend is reachable at https://studysync-136760819044.us-central1.run.app"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Group {id}</h1>
                    <p className="text-slate-600">Share files, chat, and collaborate with your group.</p>
                </div>
                <button className="rounded-md border bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                    Join Group
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: RAG Features (Upload & Chat) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* File Upload Section */}
                    <div className="p-6 border rounded-xl bg-white shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Upload Group Files</h2>
                        <div className="space-y-4">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                            />
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploadStatus === "Uploading..."}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploadStatus === "Uploading..." ? "Uploading..." : "Upload File"}
                            </button>
                            {uploadStatus && <p className="text-sm text-slate-600">{uploadStatus}</p>}
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="p-6 border rounded-xl bg-white shadow-sm flex flex-col h-[600px]">
                        <h2 className="text-xl font-semibold mb-4">Chat with Files</h2>
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 border rounded-md bg-slate-50">
                            {messages.length === 0 && (
                                <p className="text-center text-slate-400 mt-10">Ask a question about the uploaded files.</p>
                            )}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user"
                                        ? "bg-blue-600 text-white ml-auto"
                                        : "bg-white border text-slate-800 mr-auto"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {loading && <div className="text-sm text-slate-500 italic">Thinking...</div>}
                        </div>
                        <form onSubmit={handleChat} className="flex gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Dashboard Info */}
                </div>
        </div>
    );
}
