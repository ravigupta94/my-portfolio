"use client";
import { useState, useEffect, FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  category?: string;
}

const EMPTY: Partial<Project> = { title: "", slug: "", description: "", techStack: [], featured: true, order: 0 };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Project>>(EMPTY);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [techInput, setTechInput] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditItem(EMPTY);
    setTechInput("");
    setIsEditing(false);
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditItem({ ...p });
    setTechInput(p.techStack.join(", "));
    setIsEditing(true);
    setModalOpen(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const tech = techInput.split(",").map((t) => t.trim()).filter(Boolean);
    const body = { ...editItem, techStack: tech };
    const url = isEditing ? `/api/admin/projects/${editItem._id}` : "/api/admin/projects";
    const method = isEditing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setModalOpen(false); load(); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    setDeleting(false);
    load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-white/40 mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>
        <button onClick={openCreate} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
          + Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-20">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <div key={p._id} className="bg-[#0d0d14] border border-white/10 rounded-xl p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{p.title}</span>
                  {p.featured && <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">Featured</span>}
                  {p.category && <span className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full border border-white/10">{p.category}</span>}
                </div>
                <p className="text-sm text-white/50 truncate">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.techStack.slice(0, 5).map((t) => (
                    <span key={t} className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded-full border border-white/10">{t}</span>
                  ))}
                  {p.techStack.length > 5 && <span className="text-xs text-white/30">+{p.techStack.length - 5} more</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors">Edit</button>
                <button onClick={() => setDeleteId(p._id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <div className="text-center text-white/30 py-16 border border-dashed border-white/10 rounded-xl">No projects yet. Click &quot;Add Project&quot; to get started.</div>}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? "Edit Project" : "Add Project"} size="xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Title *</label>
              <input required value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Slug *</label>
              <input required value={editItem.slug || ""} onChange={(e) => setEditItem({ ...editItem, slug: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Short Description *</label>
            <input required value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Long Description</label>
            <textarea rows={3} value={editItem.longDescription || ""} onChange={(e) => setEditItem({ ...editItem, longDescription: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Tech Stack (comma-separated)</label>
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Node.js, MongoDB..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Live URL</label>
              <input value={editItem.liveUrl || ""} onChange={(e) => setEditItem({ ...editItem, liveUrl: e.target.value })} placeholder="https://"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">GitHub URL</label>
              <input value={editItem.githubUrl || ""} onChange={(e) => setEditItem({ ...editItem, githubUrl: e.target.value })} placeholder="https://github.com/"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Category</label>
              <input value={editItem.category || ""} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} placeholder="Web App, AI, etc."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Order</label>
              <input type="number" value={editItem.order ?? 0} onChange={(e) => setEditItem({ ...editItem, order: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editItem.featured ?? true} onChange={(e) => setEditItem({ ...editItem, featured: e.target.checked })} className="w-4 h-4 accent-violet-600" />
                <span className="text-sm text-white/60">Featured</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting}
        message="This will permanently delete the project." />
    </div>
  );
}