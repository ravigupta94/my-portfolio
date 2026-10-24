"use client";
import { useState, useEffect, FormEvent } from "react";

interface Service { title: string; description: string; icon?: string; }
interface Company { name: string; tagline: string; description: string; mission: string; vision: string; services: Service[]; teamSize: number; founderName: string; founderRole: string; website: string; location: string; email?: string; founded?: string; }
const EMPTY_SERVICE: Service = { title: "", description: "", icon: "" };

export default function CompanyPage() {
  const [data, setData] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/company");
      const data = await res.json();
      setData(data && !data.error ? data : {});
    } catch {
      setData({});
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault(); setSaving(true); setSaved(false);
    await fetch("/api/admin/company", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function updateService(idx: number, field: keyof Service, value: string) {
    const services = [...(data.services || [])];
    services[idx] = { ...services[idx], [field]: value };
    setData({ ...data, services });
  }
  function addService() { setData({ ...data, services: [...(data.services || []), { ...EMPTY_SERVICE }] }); }
  function removeService(idx: number) { setData({ ...data, services: (data.services || []).filter((_, i) => i !== idx) }); }

  if (loading) return <div className="p-8 text-white/40 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Company</h1><p className="text-white/40 mt-1">ARintelligenceX details</p></div>
        {saved && <span className="text-green-400 text-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-lg">✓ Saved!</span>}
      </div>
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Info</h3>
          {[["name","Company Name"],["tagline","Tagline"],["website","Website URL"],["location","Location"],["email","Email"],["founded","Founded Year"]].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm text-white/60 mb-1">{label}</label>
              <input value={(data as any)[field] || ""} onChange={(e) => setData({ ...data, [field]: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Founder Name</label>
              <input value={data.founderName || ""} onChange={(e) => setData({ ...data, founderName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Team Size</label>
              <input type="number" value={data.teamSize || 7} onChange={(e) => setData({ ...data, teamSize: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          </div>
        </div>
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Descriptions</h3>
          {[["description","Company Description"],["mission","Mission"],["vision","Vision"]].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm text-white/60 mb-1">{label}</label>
              <textarea rows={3} value={(data as any)[field] || ""} onChange={(e) => setData({ ...data, [field]: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
            </div>
          ))}
        </div>
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Services</h3>
            <button type="button" onClick={addService} className="text-xs text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-lg hover:bg-violet-500/10">+ Add Service</button>
          </div>
          {(data.services || []).map((svc, idx) => (
            <div key={idx} className="border border-white/10 rounded-xl p-4 space-y-3 relative">
              <button type="button" onClick={() => removeService(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-300 text-lg">×</button>
              <input value={svc.title} onChange={(e) => updateService(idx, "title", e.target.value)} placeholder="Service title"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
              <textarea rows={2} value={svc.description} onChange={(e) => updateService(idx, "description", e.target.value)} placeholder="Service description"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
            </div>
          ))}
        </div>
        <button type="submit" disabled={saving} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-medium disabled:opacity-50">
          {saving ? "Saving..." : "Save Company Info"}
        </button>
      </form>
    </div>
  );
}
