"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", margin: 0, padding: "20px" }}>
        <div style={{ margin: "auto", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>System Error</h1>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>{error.message || "A critical error occurred."}</p>
          <button
            onClick={() => reset()}
            style={{ backgroundColor: "#7c3aed", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}