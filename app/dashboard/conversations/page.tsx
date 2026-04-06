"use client";

import { useState, useEffect } from "react";

interface Conversation {
  id: string;
  visitorId: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{ content: string; role: string }>;
  _count: { messages: number };
}

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export default function ConversationsPage() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations")
      .then(r => r.json())
      .then(data => { setConvos(data); setLoading(false); });
  }, []);

  async function selectConvo(id: string) {
    setSelected(id);
    const res = await fetch(`/api/conversations/${id}`);
    const data = await res.json();
    setMessages(data.messages || []);
  }

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Conversations</h1>
      <p className="text-gray-500 mb-8">View all customer chat sessions.</p>

      {convos.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center text-gray-400">
          <p className="text-lg mb-2">No conversations yet</p>
          <p className="text-sm">Once your widget is live, conversations will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation list */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="divide-y">
              {convos.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectConvo(c.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selected === c.id ? "bg-indigo-50 border-l-2 border-indigo-500" : ""}`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Visitor {c.visitorId.slice(0, 8)}...
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c._count.messages} messages · {new Date(c.updatedAt).toLocaleDateString()}
                  </p>
                  {c.messages[0] && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{c.messages[0].content}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Message view */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm">
            {selected ? (
              <div className="flex flex-col h-[500px]">
                <div className="px-6 py-4 border-b">
                  <p className="font-medium text-gray-900">Conversation</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        <p>{m.content}</p>
                        <p className={`text-xs mt-1 ${m.role === "user" ? "text-indigo-200" : "text-gray-400"}`}>
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-gray-400">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
