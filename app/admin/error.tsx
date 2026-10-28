"use client";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-4xl mb-3">⚠️</div>
      <h2 className="text-xl font-bold text-white mb-2">Admin Section Error</h2>
      <p className="text-white/50 text-sm max-w-md mb-6">
        {error.message || "An error occurred while loading this admin view."}
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
      >
        Retry Action
      </button>
    </div>
  );
}
