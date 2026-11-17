"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaCopy,
  FaCheck,
  FaWhatsapp,
  FaTimes,
  FaMapMarkerAlt,
  FaEnvelopeOpen,
  FaHeart,
  FaHourglassHalf,
  FaCalendarAlt,
  FaImages,
  FaGift,
  FaCommentDots,
  FaCompactDisc,
} from "react-icons/fa";
import { config as defaultConfig } from "@/lib/config";

interface MainContentProps {
  name?: string;
  config?: any;
  isPreview?: boolean;
}

interface Wish {
  _id: string;
  name: string;
  attendance: string;
  guests?: number;
  message: string;
  createdAt?: string;
}

const DEFAULT_GALLERY = [
  "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-s1-1-1.jpg",
  "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-cover-1-1.jpg",
  "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-s1-1-2.jpg",
  "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-cover-1.jpg",
  "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-g2-1-1.jpg",
  "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-g2-1.jpg",
];

export default function MainContent({
  name,
  config: dynamicConfig,
  isPreview = false,
}: MainContentProps) {
  const cfg = dynamicConfig || defaultConfig;

  // Cover opening state
  const [isOpen, setIsOpen] = useState(isPreview);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [giftTab, setGiftTab] = useState<"amplop" | "kado">("amplop");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Wishes / RSVP state
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formName, setFormName] = useState(name || "");
  const [formAttendance, setFormAttendance] = useState("hadir");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const galleryImages = cfg.galleryImages && cfg.galleryImages.length > 0 ? cfg.galleryImages : DEFAULT_GALLERY;

  const leftHeroImage =
    cfg.slideImages?.sideImage ||
    cfg.slideImages?.slide10 ||
    cfg.slideImages?.slide1 ||
    "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-cover-1-1.jpg";

  // Countdown timer logic
  useEffect(() => {
    const target = new Date(cfg.eventDate || "2026-12-13T09:00:00").getTime();
    const tick = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cfg.eventDate]);

  // Load wishes from API
  const fetchWishes = async () => {
    try {
      const res = await fetch("/api/get?page=1&limit=100");
      if (res.ok) {
        const data = await res.json();
        setWishes(data.wishes || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // Open invitation handler
  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Music toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  // Submit wish
  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    setIsSubmitting(true);
    const payload = {
      name: formName.trim(),
      attendance: formAttendance,
      guests: formAttendance === "tidak_hadir" ? 0 : 1,
      message: formMessage.trim(),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setWishes((prev) => [
          {
            _id: `temp_${Date.now()}`,
            name: payload.name,
            attendance: payload.attendance,
            message: payload.message,
            createdAt: new Date().toISOString(),
          },
          ...prev.filter((w) => w.name !== payload.name),
        ]);
        setFormMessage("");
      }
    } catch {
      // fallback local
      setWishes((prev) => [
        {
          _id: `temp_${Date.now()}`,
          name: payload.name,
          attendance: payload.attendance,
          message: payload.message,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setFormMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w) => (w === "&" || w === "dan" || w === "and" ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#f5f0e8] text-[#3d2b1f] font-montserrat relative">
      {/* ══════════════ AUDIO ELEMENT ══════════════ */}
      <audio
        ref={audioRef}
        src={cfg.musicPath || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"}
        loop
        preload="auto"
      />

      {/* ══════════════ FLOATING MUSIC BUTTON ══════════════ */}
      {isOpen && (
        <button
          onClick={toggleMusic}
          className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-[#4a3425]/90 border border-[#b8976a] text-[#b8976a] flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform hover:scale-110"
          title={isPlaying ? "Pause Musik" : "Putar Musik"}
        >
          <FaCompactDisc className={`w-6 h-6 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
        </button>
      )}

      {/* ══════════════ STICKY NAVIGATION (BOTTOM) ══════════════ */}
      {isOpen && (
        <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-[#4a3425]/90 border border-[#b8976a]/40 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md">
          <a href="#section-groomBride" className="text-[#d4b896] hover:text-[#b8976a] p-1.5 transition" title="Mempelai">
            <FaHeart className="w-4 h-4" />
          </a>
          <a href="#section-countdown" className="text-[#d4b896] hover:text-[#b8976a] p-1.5 transition" title="Countdown">
            <FaHourglassHalf className="w-4 h-4" />
          </a>
          <a href="#section-events" className="text-[#d4b896] hover:text-[#b8976a] p-1.5 transition" title="Acara">
            <FaCalendarAlt className="w-4 h-4" />
          </a>
          <a href="#section-media" className="text-[#d4b896] hover:text-[#b8976a] p-1.5 transition" title="Galeri">
            <FaImages className="w-4 h-4" />
          </a>
          <a href="#section-weddingGift" className="text-[#d4b896] hover:text-[#b8976a] p-1.5 transition" title="Kado">
            <FaGift className="w-4 h-4" />
          </a>
          <a href="#section-rsvp" className="text-[#d4b896] hover:text-[#b8976a] p-1.5 transition" title="Ucapan">
            <FaCommentDots className="w-4 h-4" />
          </a>
        </nav>
      )}

      {/* ══════════════ LIGHTBOX MODAL ══════════════ */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-6 text-white text-2xl hover:text-[#d4b896]"
          >
            <FaTimes />
          </button>
          <img src={lightboxSrc} alt="Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}

      {/* ══════════════ LEFT PANE: WIDE / LANDSCAPE DESKTOP HERO ══════════════ */}
      <div
        className="hidden md:flex flex-col justify-between items-center p-10 lg:p-14 md:w-3/5 lg:w-2/3 h-screen sticky top-0 relative overflow-hidden text-white select-none"
        style={{
          backgroundImage: `url(${leftHeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20150a]/90 via-[#20150a]/40 to-[#20150a]/70 pointer-events-none" />

        {/* Subtle inner gold frame */}
        <div className="absolute inset-6 border border-[#b8976a]/30 rounded-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 text-center flex flex-col items-center">
          <img
            src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
            alt="Ornament"
            className="w-24 opacity-85 mb-2"
          />
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#d4b896]">
            The Wedding Celebration of
          </p>
        </div>

        {/* Center Hero Info */}
        <div className="relative z-10 text-center flex flex-col items-center max-w-xl px-4">
          <h1 className="font-great-vibes text-6xl lg:text-7xl xl:text-8xl text-[#f5f0e8] drop-shadow-lg tracking-wide mb-2">
            {toTitleCase(cfg.coupleNames)}
          </h1>
          <div className="w-16 h-[1.5px] bg-[#b8976a] my-3" />
          <p className="font-montserrat text-xs lg:text-sm text-[#ede5d5] uppercase tracking-[0.25em] mb-4">
            {new Date(cfg.eventDate).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="font-cormorant italic text-sm lg:text-base text-[#ede5d5]/90 leading-relaxed max-w-md drop-shadow">
            &ldquo;Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.&rdquo;
          </p>
          <span className="text-[10px] uppercase tracking-widest text-[#d4b896] mt-1 font-semibold">
            Markus 10:9
          </span>

          {/* Desktop Live Countdown */}
          <div className="mt-8 bg-black/40 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#b8976a]/30 shadow-2xl flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="font-cormorant text-3xl font-light text-[#f5f0e8] block leading-none">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#d4b896] block mt-1">Hari</span>
            </div>
            <span className="font-cormorant text-2xl text-[#b8976a]">:</span>
            <div className="text-center">
              <span className="font-cormorant text-3xl font-light text-[#f5f0e8] block leading-none">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#d4b896] block mt-1">Jam</span>
            </div>
            <span className="font-cormorant text-2xl text-[#b8976a]">:</span>
            <div className="text-center">
              <span className="font-cormorant text-3xl font-light text-[#f5f0e8] block leading-none">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#d4b896] block mt-1">Menit</span>
            </div>
            <span className="font-cormorant text-2xl text-[#b8976a]">:</span>
            <div className="text-center">
              <span className="font-cormorant text-3xl font-light text-[#f5f0e8] block leading-none">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#d4b896] block mt-1">Detik</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 text-center flex items-center gap-2 text-[11px] text-[#d4b896] tracking-widest uppercase bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full border border-white/10">
          <span>Scroll panel kanan untuk melihat detail acara</span>
          <span className="text-sm animate-pulse">➔</span>
        </div>
      </div>

      {/* ══════════════ RIGHT PANE: FULL EKSKLUSIF-9 INVITATION ══════════════ */}
      <div className="w-full md:w-2/5 lg:w-1/3 h-screen overflow-y-auto scroll-smooth relative">
        {/* ─── COVER SCREEN OVERLAY (UNLESS OPENED) ─── */}
        {!isOpen && (
          <div
            className="fixed md:absolute inset-0 z-50 flex flex-col items-center justify-center text-center p-6 bg-[#4a3425] text-white select-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at center, rgba(74,52,37,0.88) 0%, rgba(20,15,10,0.96) 100%), url('https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png')",
              backgroundSize: "cover, 75%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <img
              src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
              alt=""
              className="w-24 md:w-32 mb-6 opacity-85"
            />
            <p className="text-[11px] font-medium tracking-[0.35em] text-[#d4b896] uppercase mb-3">
              The Wedding Of
            </p>
            <h1 className="font-great-vibes text-5xl md:text-6xl text-[#f5f0e8] leading-tight mb-2">
              {toTitleCase(cfg.coupleNames)}
            </h1>
            <div className="w-14 h-[1px] bg-[#b8976a] my-3"></div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d4b896]">
              {new Date(cfg.eventDate).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="mt-8">
              <p className="text-[11px] tracking-widest text-[#ede5d5] uppercase">Kepada Yth.</p>
              <p className="text-sm font-semibold text-[#f5f0e8] mt-1">{name || "Bapak / Ibu / Saudara/i"}</p>
            </div>

            <button
              onClick={handleOpen}
              className="mt-8 px-8 py-3 rounded-full border border-[#b8976a] text-[#d4b896] hover:bg-[#b8976a] hover:text-white transition-all text-xs font-medium tracking-[0.25em] uppercase flex items-center gap-2 shadow-lg"
            >
              <FaEnvelopeOpen className="text-sm" />
              <span>Buka Undangan</span>
            </button>
          </div>
        )}

        {/* ─── SECTION 1: AYAT FIRMAN ─── */}
        <section
          id="section-general"
          className="bg-[#4a3425] text-white py-16 px-6 text-center border-b border-[#b8976a]/20"
        >
          <div className="max-w-md mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#b8976a] mb-2 font-medium">Firman Tuhan</p>
            <p className="font-cormorant italic text-base md:text-lg text-[#ede5d5] leading-relaxed mb-3">
              &ldquo;Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya,
              sehingga keduanya menjadi satu daging.&rdquo;
            </p>
            <p className="text-[11px] tracking-widest uppercase text-[#b8976a] font-semibold">Kejadian 2:24</p>

            <div className="w-8 h-[1px] bg-[#b8976a]/50 mx-auto my-6" />

            <p className="font-cormorant italic text-base md:text-lg text-[#ede5d5] leading-relaxed mb-3">
              &ldquo;Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.&rdquo;
            </p>
            <p className="text-[11px] tracking-widest uppercase text-[#b8976a] font-semibold">Markus 10:9</p>
          </div>
        </section>

        {/* ─── SECTION 2: OUR WEDDING INVITATION ─── */}
        <section className="bg-[#ede5d5] py-16 px-6 text-center">
          <div className="max-w-md mx-auto">
            <img
              src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
              alt=""
              className="w-32 mx-auto mb-4 opacity-85"
            />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#b8976a] mb-1">Our</p>
            <h2 className="font-great-vibes text-4xl text-[#6b4f35] mb-2">Wedding</h2>
            <div className="w-12 h-[1px] bg-[#b8976a] mx-auto my-3" />
            <p className="text-xs text-[#7a6450] leading-relaxed max-w-sm mx-auto">
              Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara
              pernikahan kami.
            </p>

            <div className="mt-8 rounded-xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src={galleryImages[1] || "https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-cover-1-1.jpg"}
                alt="Highlight"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: MEMPELAI (BRIDE & GROOM) ─── */}
        <section id="section-groomBride" className="bg-[#f5f0e8] py-16 px-6 text-center">
          <div className="max-w-md mx-auto">
            <img
              src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
              alt=""
              className="w-32 mx-auto mb-4 opacity-85"
            />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#b8976a] mb-1">The Bride &amp; Groom</p>
            <h2 className="font-great-vibes text-4xl text-[#6b4f35] mb-2">Mempelai</h2>
            <div className="w-12 h-[1px] bg-[#b8976a] mx-auto my-3" />

            <div className="flex flex-col gap-10 mt-8">
              {/* WANITA */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ede5d5]">
                <img
                  src="https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-wanita.jpg"
                  alt={cfg.bride}
                  className="w-28 h-36 object-cover rounded-t-full mx-auto border-2 border-[#d4b896] mb-3 shadow"
                />
                <h3 className="font-great-vibes text-3xl text-[#6b4f35]">{cfg.brideNickName || "Elia"}</h3>
                <p className="text-xs font-semibold tracking-wider text-[#4a3425] mt-1">{cfg.bride}</p>
                <div className="w-8 h-[1px] bg-[#b8976a] mx-auto my-2" />
                <p className="text-[11px] text-[#7a6450] leading-relaxed whitespace-pre-line">{cfg.brideBio}</p>
                {cfg.brideInstagram && (
                  <Link
                    href={`https://instagram.com/${cfg.brideInstagram.replace("@", "")}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full border border-[#d4b896] text-[#b8976a] hover:bg-[#b8976a] hover:text-white transition text-[11px] font-medium"
                  >
                    <FaInstagram /> <span>@{cfg.brideInstagram.replace("@", "")}</span>
                  </Link>
                )}
              </div>

              {/* SIMBOL DAN */}
              <div className="font-great-vibes text-4xl text-[#b8976a] my-[-10px]">&amp;</div>

              {/* PRIA */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ede5d5]">
                <img
                  src="https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-pria.jpg"
                  alt={cfg.groom}
                  className="w-28 h-36 object-cover rounded-t-full mx-auto border-2 border-[#d4b896] mb-3 shadow"
                />
                <h3 className="font-great-vibes text-3xl text-[#6b4f35]">{cfg.groomNickName || "Juan"}</h3>
                <p className="text-xs font-semibold tracking-wider text-[#4a3425] mt-1">{cfg.groom}</p>
                <div className="w-8 h-[1px] bg-[#b8976a] mx-auto my-2" />
                <p className="text-[11px] text-[#7a6450] leading-relaxed whitespace-pre-line">{cfg.groomBio}</p>
                {cfg.groomInstagram && (
                  <Link
                    href={`https://instagram.com/${cfg.groomInstagram.replace("@", "")}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full border border-[#d4b896] text-[#b8976a] hover:bg-[#b8976a] hover:text-white transition text-[11px] font-medium"
                  >
                    <FaInstagram /> <span>@{cfg.groomInstagram.replace("@", "")}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: COUNTDOWN ─── */}
        <section
          id="section-countdown"
          className="bg-gradient-to-br from-[#4a3425] to-[#6b4f35] text-white py-16 px-6 text-center relative overflow-hidden"
        >
          <div className="max-w-md mx-auto relative z-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4b896] mb-1">Menuju Hari Bahagia</p>
            <h2 className="font-great-vibes text-4xl text-[#f5f0e8] mb-2">Save The Date</h2>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#d4b896] mb-8 font-medium">
              {new Date(cfg.eventDate).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <span className="font-cormorant text-4xl font-light text-[#f5f0e8] block leading-none">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#d4b896] block mt-1">Hari</span>
              </div>
              <span className="font-cormorant text-2xl text-[#b8976a]">:</span>
              <div className="text-center">
                <span className="font-cormorant text-4xl font-light text-[#f5f0e8] block leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#d4b896] block mt-1">Jam</span>
              </div>
              <span className="font-cormorant text-2xl text-[#b8976a]">:</span>
              <div className="text-center">
                <span className="font-cormorant text-4xl font-light text-[#f5f0e8] block leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#d4b896] block mt-1">Menit</span>
              </div>
              <span className="font-cormorant text-2xl text-[#b8976a]">:</span>
              <div className="text-center">
                <span className="font-cormorant text-4xl font-light text-[#f5f0e8] block leading-none">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#d4b896] block mt-1">Detik</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: ACARA (PEMBERKATAN & RESEPSI) ─── */}
        <section id="section-events" className="bg-[#ede5d5] py-16 px-6 text-center">
          <div className="max-w-md mx-auto">
            <img
              src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
              alt=""
              className="w-32 mx-auto mb-4 opacity-85"
            />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#b8976a] mb-1">Save</p>
            <h2 className="font-great-vibes text-4xl text-[#6b4f35] mb-2">The Date</h2>
            <div className="w-12 h-[1px] bg-[#b8976a] mx-auto my-3" />

            <div className="flex flex-col gap-6 mt-8">
              {/* PEMBERKATAN */}
              {cfg.holyMatrimony?.enabled && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-[#b8976a] text-center">
                  <h3 className="font-great-vibes text-3xl text-[#6b4f35] mb-2">Pemberkatan</h3>
                  <p className="text-xs font-semibold text-[#4a3425]">Minggu, 13 Desember 2026</p>
                  <p className="text-xs text-[#7a6450] mt-1">{cfg.holyMatrimony.time || "Pukul 09.00 WIB"}</p>

                  <div className="w-8 h-[1px] bg-[#ede5d5] mx-auto my-3" />

                  <p className="text-xs font-bold text-[#4a3425]">{cfg.holyMatrimony.place || "GMAHK Gresik"}</p>
                  <p className="text-[11px] text-[#7a6450] mt-1 leading-relaxed">{cfg.holyMatrimony.place_details}</p>

                  {cfg.holyMatrimony.googleMapsLink && (
                    <Link
                      href={cfg.holyMatrimony.googleMapsLink}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 mt-5 px-5 py-2 rounded-full bg-[#4a3425] text-[#ede5d5] hover:bg-[#b8976a] transition text-[11px] tracking-wider uppercase font-medium"
                    >
                      <FaMapMarkerAlt /> <span>Lokasi Acara</span>
                    </Link>
                  )}
                </div>
              )}

              {/* RESEPSI */}
              {cfg.weddingReception?.enabled && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-[#b8976a] text-center">
                  <h3 className="font-great-vibes text-3xl text-[#6b4f35] mb-2">Resepsi</h3>
                  <p className="text-xs font-semibold text-[#4a3425]">Minggu, 13 Desember 2026</p>
                  <p className="text-xs text-[#7a6450] mt-1">{cfg.weddingReception.time || "Pukul 13.00 WIB"}</p>

                  <div className="w-8 h-[1px] bg-[#ede5d5] mx-auto my-3" />

                  <p className="text-xs font-bold text-[#4a3425]">{cfg.weddingReception.place || "Gedung Dakwah Muhammadiyah Gresik"}</p>
                  <p className="text-[11px] text-[#7a6450] mt-1 leading-relaxed">{cfg.weddingReception.place_details}</p>

                  {cfg.weddingReception.googleMapsLink && (
                    <Link
                      href={cfg.weddingReception.googleMapsLink}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 mt-5 px-5 py-2 rounded-full bg-[#4a3425] text-[#ede5d5] hover:bg-[#b8976a] transition text-[11px] tracking-wider uppercase font-medium"
                    >
                      <FaMapMarkerAlt /> <span>Lokasi Acara</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── SECTION 6: LOVE STORY ─── */}
        <section id="section-loveJourney" className="bg-[#f5f0e8] py-16 px-6 text-center">
          <div className="max-w-md mx-auto">
            <img
              src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
              alt=""
              className="w-32 mx-auto mb-4 opacity-85"
            />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#b8976a] mb-1">Love</p>
            <h2 className="font-great-vibes text-4xl text-[#6b4f35] mb-2">Story</h2>
            <div className="w-12 h-[1px] bg-[#b8976a] mx-auto my-3" />

            <div className="flex flex-col gap-8 mt-8 text-left">
              {/* Item 1 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#ede5d5]">
                <img
                  src="https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-g2-1-1.jpg"
                  alt="Awal Bertemu"
                  className="w-full h-44 object-cover rounded-xl mb-3"
                />
                <span className="text-[10px] tracking-widest uppercase text-[#b8976a] font-semibold block">
                  {cfg.timeline_1 || "Awal Bertemu"}
                </span>
                <h4 className="font-cormorant text-lg font-bold text-[#4a3425] mt-0.5">Pertemuan Pertama</h4>
                <p className="text-[11px] text-[#7a6450] leading-relaxed mt-1">
                  {cfg.timeline_1_content ||
                    "Kisah indah ini berawal dari pertemuan kami. Dua insan yang dipertemukan oleh Tuhan untuk saling mengenal dan melengkapi dalam kasih."}
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#ede5d5]">
                <img
                  src="https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-g2-1-1.jpg"
                  alt="Jadian"
                  className="w-full h-44 object-cover rounded-xl mb-3"
                />
                <span className="text-[10px] tracking-widest uppercase text-[#b8976a] font-semibold block">
                  {cfg.timeline_2 || "Jadian"}
                </span>
                <h4 className="font-cormorant text-lg font-bold text-[#4a3425] mt-0.5">Resmi Bersama</h4>
                <p className="text-[11px] text-[#7a6450] leading-relaxed mt-1">
                  {cfg.timeline_2_content ||
                    "Setelah saling mengenal dan melewati perjalanan bersama, kami berkomitmen untuk melangkah ke masa depan bersama dalam doa dan komitmen."}
                </p>
              </div>

              {/* Item 3 */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#ede5d5]">
                <img
                  src="https://web.menujuacara.id/wp-content/uploads/2025/09/tema-eksklusif-cb-g2-1.jpg"
                  alt="Lamaran"
                  className="w-full h-44 object-cover rounded-xl mb-3"
                />
                <span className="text-[10px] tracking-widest uppercase text-[#b8976a] font-semibold block">
                  {cfg.timeline_3 || "Lamaran"}
                </span>
                <h4 className="font-cormorant text-lg font-bold text-[#4a3425] mt-0.5">Ikatan Suci</h4>
                <p className="text-[11px] text-[#7a6450] leading-relaxed mt-1">
                  {cfg.timeline_3_content ||
                    "Juan memberanikan diri membawa keluarga besarnya bersilaturahmi ke kediaman Elia untuk melamar dan memohon restu pernikahan."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 7: MOMENT GALLERY ─── */}
        <section id="section-media" className="bg-[#ede5d5] py-16 px-6 text-center">
          <div className="max-w-md mx-auto">
            <img
              src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
              alt=""
              className="w-32 mx-auto mb-4 opacity-85"
            />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#b8976a] mb-1">Moment</p>
            <h2 className="font-great-vibes text-4xl text-[#6b4f35] mb-2">Gallery</h2>
            <div className="w-12 h-[1px] bg-[#b8976a] mx-auto my-3" />

            <div className="grid grid-cols-2 gap-2.5 mt-8">
              {galleryImages.map((src: string, idx: number) => {
                const isTall = idx === 0 || idx === 3;
                return (
                  <div
                    key={idx}
                    onClick={() => setLightboxSrc(src)}
                    className={`overflow-hidden rounded-xl shadow-md cursor-pointer group relative ${
                      isTall ? "row-span-2 h-72" : "h-34"
                    }`}
                  >
                    <img
                      src={src}
                      alt="Gallery"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── SECTION 8: WEDDING GIFT ─── */}
        <section id="section-weddingGift" className="bg-[#f5f0e8] py-16 px-6 text-center">
          <div className="max-w-md mx-auto">
            <img
              src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
              alt=""
              className="w-32 mx-auto mb-4 opacity-85"
            />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#b8976a] mb-1">Wedding</p>
            <h2 className="font-great-vibes text-4xl text-[#6b4f35] mb-2">Gift</h2>
            <div className="w-12 h-[1px] bg-[#b8976a] mx-auto my-3" />
            <p className="text-xs text-[#7a6450] leading-relaxed max-w-sm mx-auto mb-6">
              Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika ingin memberikan tanda kasih secara
              cashless, Anda dapat mengirimkannya melalui:
            </p>

            {/* Tabs */}
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={() => setGiftTab("amplop")}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition ${
                  giftTab === "amplop"
                    ? "bg-[#b8976a] text-white shadow"
                    : "border border-[#d4b896] text-[#6b4f35] hover:bg-[#ede5d5]"
                }`}
              >
                Amplop Online
              </button>
              <button
                onClick={() => setGiftTab("kado")}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition ${
                  giftTab === "kado"
                    ? "bg-[#b8976a] text-white shadow"
                    : "border border-[#d4b896] text-[#6b4f35] hover:bg-[#ede5d5]"
                }`}
              >
                Kirim Kado
              </button>
            </div>

            {/* Panel Amplop */}
            {giftTab === "amplop" && (
              <div className="flex flex-col gap-4">
                {/* BCA */}
                <div className="bg-[#4a3425] text-white p-6 rounded-2xl shadow-md text-center border border-[#b8976a]/30">
                  <span className="text-[11px] font-bold tracking-widest uppercase border border-[#b8976a] text-[#b8976a] px-3 py-1 rounded inline-block mb-3">
                    BCA
                  </span>
                  <p className="font-cormorant text-2xl tracking-widest text-[#f5f0e8] font-bold">5110127610</p>
                  <p className="text-xs text-[#d4b896] mt-0.5">a/n Elia Kristiawati</p>
                  <button
                    onClick={() => handleCopy("5110127610", "bca")}
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full border border-[#b8976a] text-[#d4b896] hover:bg-[#b8976a] hover:text-white transition text-[11px] font-medium"
                  >
                    {copiedKey === "bca" ? <FaCheck /> : <FaCopy />}
                    <span>{copiedKey === "bca" ? "Tersalin!" : "Salin No. Rekening"}</span>
                  </button>
                </div>

                {/* Mandiri */}
                <div className="bg-[#4a3425] text-white p-6 rounded-2xl shadow-md text-center border border-[#b8976a]/30">
                  <span className="text-[11px] font-bold tracking-widest uppercase border border-[#b8976a] text-[#b8976a] px-3 py-1 rounded inline-block mb-3">
                    Mandiri
                  </span>
                  <p className="font-cormorant text-2xl tracking-widest text-[#f5f0e8] font-bold">1410022533053</p>
                  <p className="text-xs text-[#d4b896] mt-0.5">a/n Adriel Juan Ardika</p>
                  <button
                    onClick={() => handleCopy("1410022533053", "mandiri")}
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full border border-[#b8976a] text-[#d4b896] hover:bg-[#b8976a] hover:text-white transition text-[11px] font-medium"
                  >
                    {copiedKey === "mandiri" ? <FaCheck /> : <FaCopy />}
                    <span>{copiedKey === "mandiri" ? "Tersalin!" : "Salin No. Rekening"}</span>
                  </button>
                </div>

                {/* WA Confirm */}
                <div className="mt-4">
                  <p className="text-[11px] text-[#7a6450] mb-2 font-medium">Konfirmasi pengiriman amplop via WhatsApp:</p>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="https://wa.me/628993706640?text=Halo%20Elia,%20saya%20sudah%20mengirimkan%20amplop%20online%20untuk%20pernikahan%20Elia%20%26%20Juan."
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] text-white text-xs font-semibold shadow hover:opacity-90 transition"
                    >
                      <FaWhatsapp className="text-base" /> Konfirmasi ke Elia (0899-3706-640)
                    </Link>
                    <Link
                      href="https://wa.me/628123241804?text=Halo%20Juan,%20saya%20sudah%20mengirimkan%20amplop%20online%20untuk%20pernikahan%20Elia%20%26%20Juan."
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] text-white text-xs font-semibold shadow hover:opacity-90 transition"
                    >
                      <FaWhatsapp className="text-base" /> Konfirmasi ke Juan (0812-3241-804)
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Panel Kado */}
            {giftTab === "kado" && (
              <div className="bg-[#4a3425] text-white p-6 rounded-2xl shadow-md text-center border border-[#b8976a]/30">
                <span className="text-[11px] font-bold tracking-widest uppercase border border-[#b8976a] text-[#b8976a] px-3 py-1 rounded inline-block mb-3">
                  Alamat Kirim Kado
                </span>
                <p className="text-xs text-[#ede5d5] leading-relaxed mb-4">
                  Kediaman Mempelai Wanita<br />
                  <strong>Elia Kristiawati</strong><br />
                  Kabupaten Gresik, Jawa Timur
                </p>
                <button
                  onClick={() => handleCopy("Kediaman Mempelai Wanita: Elia Kristiawati, Kabupaten Gresik, Jawa Timur", "alamat")}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#b8976a] text-[#d4b896] hover:bg-[#b8976a] hover:text-white transition text-[11px] font-medium"
                >
                  {copiedKey === "alamat" ? <FaCheck /> : <FaCopy />}
                  <span>{copiedKey === "alamat" ? "Tersalin!" : "Salin Alamat"}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ─── SECTION 9: UCAPAN & DOA (RSVP FORM + WISHES) ─── */}
        <section id="section-rsvp" className="bg-[#4a3425] text-white py-16 px-6 text-center border-t border-[#b8976a]/20">
          <div className="max-w-md mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4b896] mb-1">Ucapan &amp; Doa</p>
            <h2 className="font-great-vibes text-4xl text-[#f5f0e8] mb-2">Wishes</h2>
            <div className="w-12 h-[1px] bg-[#b8976a] mx-auto my-3" />

            {/* Form */}
            <form onSubmit={handleSubmitWish} className="text-left flex flex-col gap-3 mt-6">
              <input
                type="text"
                placeholder="Nama Anda"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-[#d4b896]/30 text-white placeholder-white/50 text-xs outline-none focus:border-[#b8976a] transition"
              />

              <select
                value={formAttendance}
                onChange={(e) => setFormAttendance(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#3d2b1f] border border-[#d4b896]/30 text-white text-xs outline-none focus:border-[#b8976a] transition"
              >
                <option value="hadir">✅ Hadir</option>
                <option value="tidak_hadir">❌ Tidak Hadir</option>
                <option value="masih_ragu">🤔 Masih Ragu</option>
              </select>

              <textarea
                placeholder="Tulis ucapan dan doa restu untuk Elia & Juan..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-[#d4b896]/30 text-white placeholder-white/50 text-xs outline-none focus:border-[#b8976a] transition resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-[#b8976a] hover:bg-[#d4b896] text-white text-xs font-semibold tracking-widest uppercase transition shadow-lg mt-1"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
              </button>
            </form>

            {/* Wishes List */}
            <div className="mt-8 flex flex-col gap-3 text-left max-h-96 overflow-y-auto pr-1">
              {wishes.length === 0 ? (
                <p className="text-xs text-white/50 text-center italic py-4">Belum ada ucapan. Jadilah yang pertama!</p>
              ) : (
                wishes.map((w, idx) => (
                  <div key={w._id || idx} className="bg-white/5 border-l-4 border-[#b8976a] p-3.5 rounded-r-xl">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#d4b896]">{w.name}</span>
                      <span
                        className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-semibold ${
                          w.attendance === "hadir"
                            ? "bg-emerald-900/60 text-emerald-300"
                            : w.attendance === "tidak_hadir"
                            ? "bg-red-900/60 text-red-300"
                            : "bg-amber-900/60 text-amber-300"
                        }`}
                      >
                        {w.attendance === "hadir" ? "Hadir" : w.attendance === "tidak_hadir" ? "Tidak Hadir" : "Ragu"}
                      </span>
                    </div>
                    <p className="text-xs text-[#ede5d5] mt-1.5 leading-relaxed">{w.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer id="section-penutup" className="bg-[#20150a] text-white py-12 px-6 text-center select-none">
          <span className="font-great-vibes text-4xl text-[#d4b896] block mb-1">
            {toTitleCase(cfg.coupleNames)}
          </span>
          <p className="text-[11px] tracking-widest uppercase text-[#b8976a] font-medium">Minggu, 13 Desember 2026</p>
          <div className="w-10 h-[1px] bg-[#b8976a]/40 mx-auto my-3" />
          <p className="text-[10px] text-white/50 tracking-wider">
            {cfg.craftedWithLove || "Crafted with ❤️ for our special day"}
          </p>
        </footer>
      </div>
    </div>
  );
}
