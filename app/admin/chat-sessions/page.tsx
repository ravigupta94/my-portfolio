"use client";
import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Message { role: string; content: string; }
interface Session { _id: string; sessionId: string; messages: Message[]; isLead: boolean; createdAt: string; updatedAt: string; }

export default function ChatSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "leads">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chat-sessions");
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      setSessions([]);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteId) return; setDeleting(true);
    await fetch(`/api/admin/chat-sessions/${deleteId}`, { method: "DELETE" });
    setDeleteId(null); setDeleting(false); load();
  }

  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const filtered = filter === "leads" ? safeSessions.filter((s) => s.isLead) : safeSessions;

  function exportCSV() {
    if (filtered.length === 0) return;
    const headers = ["Session ID", "Lead Status", "Updated At", "Messages Count", "Latest Message"];
    const rows = filtered.map((s) => [
      `"${s.sessionId}"`,
      `"${s.isLead ? 'Lead' : 'Visitor'}"`,
      `"${new Date(s.updatedAt).toLocaleString()}"`,
      `"${s.messages.length}"`,
      `"${(s.messages[s.messages.length - 1]?.content || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ravi-gupta-chat-sessions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Chat Sessions</h1>
          <p className="text-white/40 mt-1">{safeSessions.length} total · {safeSessions.filter((s) => s.isLead).length} leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilter("all")} className={`text-sm px-4 py-2 rounded-lg border transition-colors ${filter === "all" ? "bg-violet-600/20 border-violet-500/30 text-violet-400" : "border-white/10 text-white/50 hover:text-white"}`}>All</button>
          <button onClick={() => setFilter("leads")} className={`text-sm px-4 py-2 rounded-lg border transition-colors ${filter === "leads" ? "bg-orange-600/20 border-orange-500/30 text-orange-400" : "border-white/10 text-white/50 hover:text-white"}`}>🎯 Leads Only</button>
          <button onClick={exportCSV} className="text-sm px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5 font-medium">📊 Export CSV</button>
        </div>
      </div>
      {loading ? (
        <div className="text-white/40 text-center py-20">Loading...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s._id} className="bg-[#0d0d14] border border-white/10 rounded-xl overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(expanded === s._id ? null : s._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {s.isLead && <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">🎯 Lead</span>}
                    <span className="text-xs text-white/30 font-mono">{s.sessionId.slice(0, 12)}...</span>
                  </div>
                  <p className="text-sm text-white/60 truncate">
                    {s.messages[0]?.content || "Empty session"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-white/30">{new Date(s.updatedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-white/20">{s.messages.length} messages</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(s._id); }} className="text-xs px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">Delete</button>
                  <span className={`text-white/30 transition-transform ${expanded === s._id ? "rotate-180" : ""}`}>▼</span>
                </div>
              </div>
              {expanded === s._id && (
                <div className="border-t border-white/10 p-4 space-y-3 max-h-80 overflow-y-auto">
                  {s.messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs text-sm px-4 py-2.5 rounded-2xl ${m.role === "user" ? "bg-violet-600/20 text-violet-100 rounded-br-sm" : "bg-white/5 text-white/80 rounded-bl-sm border border-white/10"}`}>
                        <div className="text-xs opacity-50 mb-1">{m.role}</div>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-white/30 py-16 border border-dashed border-white/10 rounded-xl">
              {filter === "leads" ? "No leads yet." : "No chat sessions yet."}
            </div>
          )}
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="This will permanently delete this chat session." />
    </div>
  );
}
