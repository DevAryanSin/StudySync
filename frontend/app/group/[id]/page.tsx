"use client";

import { useState, use } from "react";

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
            console.log("📤 Uploading file to:", `${apiUrl}/upload`);

            const res = await fetch(`${apiUrl}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setUploadStatus(`✓ File uploaded successfully`);
                setFile(null);
                setTimeout(() => setUploadStatus(""), 3000);
            } else {
                setUploadStatus(`Error: ${data.message || "Upload failed"}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
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
            console.log("🔍 Sending chat request");

            const res = await fetch(`${apiUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, group_id: id }),
            });

            const data = await res.json();

            if (data.answer) {
                setMessages([...newMessages, { role: "bot", content: data.answer }]);
            } else {
                setMessages([...newMessages, { role: "bot", content: "Sorry, I couldn't generate a response. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...newMessages, {
                role: "bot",
                content: "Cannot connect to chatbot. Please check if the backend is running."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-900">Group {id}</h1>
                <p className="text-sm text-slate-600 mt-1">Share files and chat with your group</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chat Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chat Section */}
                    <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col h-96">
                        {/* Chat Header */}
                        <div className="bg-blue-600 text-white p-3">
                            <h2 className="font-semibold text-sm">Study Assistant</h2>
                            <p className="text-xs opacity-90">Ask questions about group materials</p>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                            {messages.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-sm text-slate-400 text-center">
                                        Upload files above and ask questions here
                                    </p>
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-xs p-3 rounded-lg text-sm ${msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 p-3 rounded-lg text-sm text-slate-600">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleChat} className="border-t border-slate-200 p-3 flex gap-2 bg-white">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type your question..."
                                disabled={loading}
                                className="flex-1 p-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 bg-white text-slate-900"
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar: File Upload */}
                <div className="space-y-4">
                    <div className="border border-slate-200 rounded-lg bg-white shadow-sm p-4">
                        <h2 className="font-semibold text-slate-900 mb-3 text-sm">Upload Materials</h2>
                        <div className="space-y-3">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-xs text-slate-600
                        file:mr-2 file:py-1 file:px-3
                        file:rounded file:border-0
                        file:text-xs file:font-semibold
                        file:bg-blue-100 file:text-blue-700
                        hover:file:bg-blue-200 cursor-pointer"
                            />
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploadStatus === "Uploading..."}
                                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                            >
                                {uploadStatus === "Uploading..." ? "Uploading..." : "Upload"}
                            </button>
                            {uploadStatus && (
                                <p className={`text-xs ${uploadStatus.includes("✓") ? "text-green-600" : "text-red-600"}`}>
                                    {uploadStatus}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Group Info */}
                    <div className="border border-slate-200 rounded-lg bg-white shadow-sm p-4">
                        <h3 className="font-semibold text-slate-900 mb-3 text-sm">Group Info</h3>
                        <div className="space-y-2 text-xs text-slate-600">
                            <p><span className="font-medium text-slate-900">ID:</span> {id}</p>
                            <p><span className="font-medium text-slate-900">Members:</span> 12</p>
                            <p><span className="font-medium text-slate-900">Topic:</span> Computer Science</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
