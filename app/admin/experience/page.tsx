"use client";
import { useState, useEffect, FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Exp { _id: string; title: string; organization: string; startDate: string; endDate?: string; current: boolean; description: string; order: number; }
const EMPTY: Partial<Exp> = { title: "", organization: "", startDate: "", current: false, description: "", order: 0 };

export default function ExperiencePage() {
  const [items, setItems] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Exp>>(EMPTY);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditItem(EMPTY); setIsEditing(false); setModalOpen(true); }
  function openEdit(e: Exp) { setEditItem({ ...e }); setIsEditing(true); setModalOpen(true); }

  async function handleSave(e: FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = isEditing ? `/api/admin/experience/${editItem._id}` : "/api/admin/experience";
    const res = await fetch(url, { method: isEditing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editItem) });
    if (res.ok) { setModalOpen(false); load(); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return; setDeleting(true);
    await fetch(`/api/admin/experience/${deleteId}`, { method: "DELETE" });
    setDeleteId(null); setDeleting(false); load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Experience</h1><p className="text-white/40 mt-1">{items.length} entries</p></div>
        <button onClick={openCreate} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium">+ Add Entry</button>
      </div>
      {loading ? <div className="text-white/40 text-center py-20">Loading...</div> : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="pl-16 relative">
                <div className="absolute left-4 top-5 w-4 h-4 rounded-full bg-violet-600 border-2 border-[#08080f]" />
                <div className="bg-[#0d0d14] border border-white/10 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-violet-400 mt-0.5">{item.organization}</div>
                      <div className="text-xs text-white/40 mt-1">{item.startDate} — {item.current ? "Present" : (item.endDate || "")}</div>
                      <p className="text-sm text-white/60 mt-2">{item.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(item)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30">Edit</button>
                      <button onClick={() => setDeleteId(item._id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-white/30 text-sm text-center py-16 border border-dashed border-white/10 rounded-xl">No experience entries yet.</div>}
          </div>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? "Edit Experience" : "Add Experience"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Job Title *</label>
              <input required value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Organization *</label>
              <input required value={editItem.organization || ""} onChange={(e) => setEditItem({ ...editItem, organization: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Start Date *</label>
              <input required value={editItem.startDate || ""} onChange={(e) => setEditItem({ ...editItem, startDate: e.target.value })} placeholder="Jan 2022"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">End Date</label>
              <input value={editItem.endDate || ""} onChange={(e) => setEditItem({ ...editItem, endDate: e.target.value })} placeholder="Dec 2023 (or leave blank)"
                disabled={editItem.current} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 disabled:opacity-40" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editItem.current ?? false} onChange={(e) => setEditItem({ ...editItem, current: e.target.checked, endDate: "" })} className="w-4 h-4 accent-violet-600" />
            <span className="text-sm text-white/60">Currently working here</span>
          </label>
          <div>
            <label className="block text-sm text-white/60 mb-1">Description *</label>
            <textarea required rows={4} value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update" : "Add Entry"}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="This will permanently delete this experience entry." />
    </div>
  );
}
