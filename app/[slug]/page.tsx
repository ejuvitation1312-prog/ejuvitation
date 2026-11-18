"use client";

import { useEffect, useState } from "react";
import MainContent from "../components/MainContent";

type ParamsProps = {
  params: { slug: string };
};

export default function Home({ params: { slug } }: ParamsProps) {
  const [name, setName] = useState<string>("");
  const [settings, setSettings] = useState<any>(null);
  const [guestStatus, setGuestStatus] = useState<"checking" | "valid" | "invalid">("checking");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get("preview") === "true";

    const initializeApp = async () => {
      const parsedSlug = decodeURIComponent(slug).replace(/-/g, " ").trim();
      setName(parsedSlug);

      let isGuestValid = true;

      if (!isPreview) {
        try {
          const validRes = await fetch(`/api/validate-guest?name=${encodeURIComponent(parsedSlug)}`);
          if (validRes.ok) {
            const validData = await validRes.json();
            isGuestValid = validData.valid ?? true;
          }
        } catch {
          isGuestValid = true;
        }
      }

      setGuestStatus(isGuestValid ? "valid" : "invalid");

      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    initializeApp();

    const handlePreviewMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "UPDATE_PREVIEW") {
        setSettings(event.data.settings);
      }
      if (event.data && event.data.type === "SCROLL_TO_SECTION") {
        const sectionId = `section-${event.data.section}`;
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    window.addEventListener("message", handlePreviewMessage);

    return () => {
      window.removeEventListener("message", handlePreviewMessage);
    };
  }, [slug]);

  if (guestStatus === "checking" || !settings) {
    return (
      <div className="min-h-screen bg-[#2b1f17] flex items-center justify-center text-white font-montserrat">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-t-[#d4b896] border-white/10 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs tracking-widest text-[#d4b896] uppercase animate-pulse">Memuat Undangan...</p>
        </div>
      </div>
    );
  }

  if (guestStatus === "invalid") {
    return (
      <div className="min-h-screen bg-[#2b1f17] flex flex-col items-center justify-center text-white font-montserrat px-6">
        <h1 className="text-3xl font-great-vibes mb-4 text-[#d4b896]">Akses Ditolak</h1>
        <p className="text-center text-[#ede5d5] text-xs max-w-sm">
          Maaf, nama Anda tidak terdaftar dalam daftar tamu undangan kami, atau link yang Anda gunakan tidak valid.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MainContent name={name} config={settings} />
    </div>
  );
}
