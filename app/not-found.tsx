import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500 mb-4">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">Page Not Found</h1>
      <p className="text-white/50 text-sm max-w-md mb-8">
        The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-600/25"
      >
        ← Back to Portfolio
      </Link>
    </div>
  );
}
