"use client";
import { useState, useEffect, FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Skill { _id: string; name: string; category: string; level: number; icon?: string; order: number; }
const EMPTY: Partial<Skill> = { name: "", category: "Frontend", level: 80, order: 0 };
const CATS = ["Frontend", "Backend", "Database", "Other"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Skill>>(EMPTY);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      setSkills([]);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditItem(EMPTY); setIsEditing(false); setModalOpen(true); }
  function openEdit(s: Skill) { setEditItem({ ...s }); setIsEditing(true); setModalOpen(true); }

  async function handleSave(e: FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = isEditing ? `/api/admin/skills/${editItem._id}` : "/api/admin/skills";
    const res = await fetch(url, { method: isEditing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editItem) });
    if (res.ok) { setModalOpen(false); load(); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return; setDeleting(true);
    await fetch(`/api/admin/skills/${deleteId}`, { method: "DELETE" });
    setDeleteId(null); setDeleting(false); load();
  }

  const safeSkills = Array.isArray(skills) ? skills : [];
  const grouped = CATS.reduce((acc, cat) => { acc[cat] = safeSkills.filter((s) => s.category === cat); return acc; }, {} as Record<string, Skill[]>);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Skills</h1><p className="text-white/40 mt-1">{skills.length} skills total</p></div>
        <button onClick={openCreate} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">+ Add Skill</button>
      </div>
      {loading ? <div className="text-white/40 text-center py-20">Loading...</div> : (
        <div className="space-y-8">
          {CATS.map((cat) => (
            <div key={cat}>
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">{cat}</h2>
              <div className="grid gap-3">
                {grouped[cat].map((s) => (
                  <div key={s._id} className="bg-[#0d0d14] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white text-sm">{s.name}</span>
                        <span className="text-xs text-white/40">{s.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${s.level}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(s)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30">Edit</button>
                      <button onClick={() => setDeleteId(s._id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">Delete</button>
                    </div>
                  </div>
                ))}
                {grouped[cat].length === 0 && <div className="text-white/20 text-sm py-3 px-4 border border-dashed border-white/5 rounded-xl">No {cat} skills yet.</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? "Edit Skill" : "Add Skill"} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Skill Name *</label>
            <input required value={editItem.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} placeholder="React, Node.js..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Category *</label>
            <select required value={editItem.category || "Frontend"} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50">
              {CATS.map((c) => <option key={c} value={c} className="bg-[#0d0d14]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Proficiency Level: {editItem.level}%</label>
            <input type="range" min={0} max={100} value={editItem.level ?? 80} onChange={(e) => setEditItem({ ...editItem, level: parseInt(e.target.value) })}
              className="w-full accent-violet-600" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Order</label>
            <input type="number" value={editItem.order ?? 0} onChange={(e) => setEditItem({ ...editItem, order: parseInt(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} message="This will permanently delete the skill." />
    </div>
  );
}