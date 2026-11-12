"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import RaviAI from "@/components/RaviAI";
import SplashCursor from "@/components/reactbits/SplashCursor";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="public-site relative">
      {/* ReactBits Fluid Simulation Cursor Splash — only on non-touch/desktop */}
      {!isTouchDevice && (
        <SplashCursor
          colors={['#7c3aed', '#3b82f6', '#06b6d4', '#ec4899']}
          zIndex={35}
          intensity={0.75}
          size={0.85}
          trail={1.1}
          rainbow={false}
        />
      )}
      <Loader />
      <Cursor />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
      <RaviAI />
    </div>
  );
}