"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/projects", label: "Projects", icon: "🚀" },
  { href: "/admin/skills", label: "Skills", icon: "💡" },
  { href: "/admin/experience", label: "Experience", icon: "🏢" },
  { href: "/admin/company", label: "Company", icon: "🏗️" },
  { href: "/admin/ai-kb", label: "AI Knowledge Base", icon: "🤖" },
  { href: "/admin/chat-sessions", label: "Chat Sessions", icon: "💬" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0d0d14] border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="text-xl font-bold text-white">⚙️ Admin Panel</div>
        <div className="text-xs text-white/40 mt-1">Ravi Gupta Portfolio</div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-violet-600/20 text-violet-400 font-medium border border-violet-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          🚪 Logout
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/60 mt-1"
        >
          🌐 View Live Site
        </Link>
      </div>
    </aside>
  );
}