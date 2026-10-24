interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
}

export default function StatCard({ label, value, icon, color = "violet" }: StatCardProps) {
  const colors: Record<string, string> = {
    violet: "border-violet-500/30 bg-violet-500/5",
    blue: "border-blue-500/30 bg-blue-500/5",
    green: "border-green-500/30 bg-green-500/5",
    orange: "border-orange-500/30 bg-orange-500/5",
    red: "border-red-500/30 bg-red-500/5",
  };
  return (
    <div className={`rounded-xl border p-6 ${colors[color] || colors.violet}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-white/50 mt-1">{label}</div>
    </div>
  );
}