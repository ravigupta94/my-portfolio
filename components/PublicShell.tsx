"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import RaviAI from "@/components/RaviAI";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="public-site">
      <Loader />
      <Cursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <RaviAI />
    </div>
  );
}