"use client";
import { useState, useEffect, FormEvent } from "react";

export default function AiKbPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ai-kb");
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
    await fetch("/api/admin/ai-kb", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function addRule() { setData({ ...data, conversationRules: [...(data.conversationRules || []), ""] }); }
  function updateRule(idx: number, val: string) {
    const rules = [...(data.conversationRules || [])];
    rules[idx] = val;
    setData({ ...data, conversationRules: rules });
  }
  function removeRule(idx: number) { setData({ ...data, conversationRules: (data.conversationRules || []).filter((_: any, i: number) => i !== idx) }); }

  function addFaq() { setData({ ...data, faqs: [...(data.faqs || []), { question: "", answer: "" }] }); }
  function updateFaq(idx: number, field: "question" | "answer", val: string) {
    const faqs = [...(data.faqs || [])];
    faqs[idx] = { ...faqs[idx], [field]: val };
    setData({ ...data, faqs });
  }
  function removeFaq(idx: number) { setData({ ...data, faqs: (data.faqs || []).filter((_: any, i: number) => i !== idx) }); }

  if (loading) return <div className="p-8 text-white/40 text-center">Loading...</div>;

  const set = (path: string, val: any) => {
    const keys = path.split(".");
    const updated = JSON.parse(JSON.stringify(data));
    let ref: any = updated;
    for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]] = ref[keys[i]] || {};
    ref[keys[keys.length - 1]] = val;
    setData(updated);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">AI Knowledge Base</h1><p className="text-white/40 mt-1">Controls what Ravi AI knows and says</p></div>
        {saved && <span className="text-green-400 text-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-lg">✓ Saved!</span>}
      </div>
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Identity */}
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Identity</h3>
          {[["identity.fullName","Full Name"],["identity.role","Role"],["identity.location","Location"],["identity.contact.email","Email"],["identity.contact.phone","Phone"]].map(([path, label]) => (
            <div key={path}>
              <label className="block text-sm text-white/60 mb-1">{label}</label>
              <input value={path.split(".").reduce((o, k) => o?.[k], data) || ""} onChange={(e) => set(path, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            {[["identity.social.linkedin","LinkedIn"],["identity.social.github","GitHub"],["identity.social.instagram","Instagram"]].map(([path, label]) => (
              <div key={path}>
                <label className="block text-xs text-white/50 mb-1">{label}</label>
                <input value={path.split(".").reduce((o: any, k) => o?.[k], data) || ""} onChange={(e) => set(path, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500/50" />
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">About & Bio</h3>
          <div>
            <label className="block text-sm text-white/60 mb-1">About Ravi (used by AI)</label>
            <textarea rows={5} value={data.about || ""} onChange={(e) => setData({ ...data, about: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
          </div>
        </div>

        {/* Skills summary */}
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Skills Summary (for AI)</h3>
          {[["skills.frontend","Frontend"],["skills.backend","Backend"],["skills.database","Database"],["skills.other","Other"]].map(([path, label]) => (
            <div key={path}>
              <label className="block text-sm text-white/60 mb-1">{label}</label>
              <input value={path.split(".").reduce((o: any, k) => o?.[k], data) || ""} onChange={(e) => set(path, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
            </div>
          ))}
        </div>

        {/* Projects & Services summary */}
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Projects & Services (AI Summary)</h3>
          <div>
            <label className="block text-sm text-white/60 mb-1">Projects Summary</label>
            <textarea rows={4} value={data.projects || ""} onChange={(e) => setData({ ...data, projects: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1">Services Summary</label>
            <textarea rows={4} value={data.services || ""} onChange={(e) => setData({ ...data, services: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
          </div>
        </div>

        {/* Conversation Rules */}
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Conversation Rules</h3>
            <button type="button" onClick={addRule} className="text-xs text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-lg hover:bg-violet-500/10">+ Add Rule</button>
          </div>
          {(data.conversationRules || []).map((rule: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input value={rule} onChange={(e) => updateRule(idx, e.target.value)} placeholder="e.g. Never reveal internal pricing"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
              <button type="button" onClick={() => removeRule(idx)} className="text-red-400 hover:text-red-300 px-3">×</button>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">FAQ Pairs</h3>
            <button type="button" onClick={addFaq} className="text-xs text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-lg hover:bg-violet-500/10">+ Add FAQ</button>
          </div>
          {(data.faqs || []).map((faq: any, idx: number) => (
            <div key={idx} className="border border-white/10 rounded-xl p-4 space-y-3 relative">
              <button type="button" onClick={() => removeFaq(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-300 text-lg">×</button>
              <input value={faq.question || ""} onChange={(e) => updateFaq(idx, "question", e.target.value)} placeholder="Question"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
              <textarea rows={2} value={faq.answer || ""} onChange={(e) => updateFaq(idx, "answer", e.target.value)} placeholder="Answer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
            </div>
          ))}
        </div>

        {/* Tone */}
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Assistant Tone</h3>
          <input value={data.assistantTone || ""} onChange={(e) => setData({ ...data, assistantTone: e.target.value })} placeholder="Friendly, confident, professional"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50" />
        </div>

        <button type="submit" disabled={saving} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-medium disabled:opacity-50">
          {saving ? "Saving..." : "💾 Save AI Knowledge Base"}
        </button>
      </form>
    </div>
  );
}
