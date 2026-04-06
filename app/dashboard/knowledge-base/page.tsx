"use client";

import { useState, useEffect } from "react";

interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function KnowledgeBasePage() {
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<KnowledgeBase> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/knowledge-base");
    const data = await res.json();
    setKbs(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.title || !editing?.content) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/knowledge-base", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    await load();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this knowledge base?")) return;
    await fetch(`/api/knowledge-base?id=${id}`, { method: "DELETE" });
    await load();
  }

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500">Paste in your FAQs and documentation. The AI uses this to answer customer questions.</p>
        </div>
        <button
          onClick={() => setEditing({ title: "", content: "" })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          + Add Knowledge Base
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {editing.id ? "Edit" : "New"} Knowledge Base
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editing.title || ""}
                onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Product FAQs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={editing.content || ""}
                onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
                rows={12}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="Paste your FAQs, product documentation, policies, etc. here..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={save}
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60 text-sm font-medium"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="border px-6 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {kbs.length === 0 && !editing ? (
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center text-gray-400">
          <p className="text-lg mb-2">No knowledge bases yet</p>
          <p className="text-sm">Click &quot;Add Knowledge Base&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {kbs.map(kb => (
            <div key={kb.id} className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{kb.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{kb.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Updated {new Date(kb.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditing(kb)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(kb.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
