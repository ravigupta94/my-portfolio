export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f] z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
        <span className="text-xs uppercase tracking-widest text-white/40 font-mono">Loading Ravi Gupta Portfolio...</span>
      </div>
    </div>
  );
}
