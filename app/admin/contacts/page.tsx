"use client";
import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, read: !currentStatus } : m))
        );
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== deleteId));
        setDeleteId(null);
      }
    } catch (e) {
      console.error("Failed to delete contact", e);
    } finally {
      setDeleting(false);
    }
  }

  function exportCSV() {
    if (safeList.length === 0) return;
    const headers = ["Date", "Name", "Email", "Status", "Message"];
    const rows = safeList.map((m) => [
      `"${new Date(m.createdAt).toLocaleString()}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${m.read ? 'Read' : 'Unread'}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ravi-gupta-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const safeList = Array.isArray(messages) ? messages : [];
  const unreadCount = safeList.filter((m) => !m.read).length;

  const filtered = safeList.filter((m) => {
    if (filter === "unread" && m.read) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Inquiries & Messages</h1>
          <p className="text-white/40 mt-1">
            {safeList.length} total messages · {unreadCount} unread
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
          />
          <button
            onClick={() => setFilter("all")}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
              filter === "all"
                ? "bg-violet-600/20 border-violet-500/30 text-violet-400 font-medium"
                : "border-white/10 text-white/50 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
              filter === "unread"
                ? "bg-blue-600/20 border-blue-500/30 text-blue-400 font-medium"
                : "border-white/10 text-white/50 hover:text-white"
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={exportCSV}
            className="text-sm px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5 font-medium"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-20">Loading messages...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item._id}
              className={`rounded-2xl border p-6 transition-all ${
                item.read
                  ? "bg-[#0d0d14] border-white/5 opacity-85"
                  : "bg-white/[0.03] border-violet-500/30 shadow-lg shadow-violet-500/5"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg text-white">{item.name}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border ${
                        item.read
                          ? "bg-white/5 text-white/40 border-white/10"
                          : "bg-violet-500/20 text-violet-300 border-violet-500/40"
                      }`}
                    >
                      {item.read ? "Read" : "New / Unread"}
                    </span>
                  </div>
                  <div className="text-sm text-violet-400 hover:underline mt-0.5">
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </div>
                  <div className="text-xs text-white/30 mt-1">
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${item.email}?subject=Re: Inquiring from Ravi Gupta Portfolio`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => toggleRead(item._id, item.read)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Mark as {item.read ? "Unread" : "Read"}
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="bg-[#08080f] rounded-xl p-4 border border-white/5 text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                {item.message}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-white/30 py-20 border border-dashed border-white/10 rounded-2xl">
              {filter === "unread"
                ? "No unread messages! You are all caught up."
                : search
                ? `No messages matching "${search}".`
                : "No contact messages received yet."}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  );
}
