import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-5xl font-extrabold text-violet-500 mb-3">404</div>
      <h2 className="text-xl font-bold text-white mb-2">Admin Resource Not Found</h2>
      <p className="text-white/50 text-sm max-w-md mb-6">
        The requested admin dashboard route does not exist.
      </p>
      <Link
        href="/admin"
        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
      >
        ← Return to Dashboard
      </Link>
    </div>
  );
}
