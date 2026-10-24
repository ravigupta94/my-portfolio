"use client";
import { useState, useEffect } from "react";
import StatCard from "@/components/admin/StatCard";
import Link from "next/link";

interface Stats { projects: number; skills: number; experience: number; sessions: number; leads: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experience: 0, sessions: 0, leads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, skills, experience, sessions] = await Promise.all([
          fetch("/api/admin/projects").then((r) => r.json()),
          fetch("/api/admin/skills").then((r) => r.json()),
          fetch("/api/admin/experience").then((r) => r.json()),
          fetch("/api/admin/chat-sessions").then((r) => r.json()),
        ]);
        const leads = Array.isArray(sessions) ? sessions.filter((s: any) => s.isLead).length : 0;
        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          experience: Array.isArray(experience) ? experience.length : 0,
          sessions: Array.isArray(sessions) ? sessions.length : 0,
          leads,
        });
      } catch (e) {
        console.error("Stats fetch failed:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const navItems = [
    { href: "/admin/projects", icon: "🚀", label: "Manage Projects", desc: "Add, edit, or delete portfolio projects" },
    { href: "/admin/skills", icon: "💡", label: "Manage Skills", desc: "Update your technical skill set" },
    { href: "/admin/experience", icon: "🏢", label: "Manage Experience", desc: "Add job or education history" },
    { href: "/admin/company", icon: "🏗️", label: "Edit Company", desc: "Update ARintelligenceX details" },
    { href: "/admin/ai-kb", icon: "🤖", label: "AI Knowledge Base", desc: "Control what Ravi AI knows" },
    { href: "/admin/chat-sessions", icon: "💬", label: "View Chat Sessions", desc: "See visitor conversations and leads" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 mt-1">Welcome back, Ravi! Here is your portfolio at a glance.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          <StatCard label="Projects" value={stats.projects} icon="🚀" color="violet" />
          <StatCard label="Skills" value={stats.skills} icon="💡" color="blue" />
          <StatCard label="Experience" value={stats.experience} icon="🏢" color="green" />
          <StatCard label="Chat Sessions" value={stats.sessions} icon="💬" color="orange" />
          <StatCard label="Leads" value={stats.leads} icon="🎯" color="red" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-violet-500/30 transition-all group"
          >
            <span className="text-3xl">{item.icon}</span>
            <div>
              <div className="font-medium text-white group-hover:text-violet-400 transition-colors">{item.label}</div>
              <div className="text-sm text-white/40 mt-0.5">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
