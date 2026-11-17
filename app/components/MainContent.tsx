"use client";

import React, { useState, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import {
  FaInstagram,
  FaCopy,
  FaCheck,
  FaWhatsapp,
  FaTimes,
  FaMapMarkerAlt,
  FaEnvelope,
  FaEnvelopeOpen,
  FaHome,
  FaUserFriends,
  FaCalendarAlt,
  FaImages,
  FaCommentDots,
  FaVolumeUp,
  FaVolumeMute,
  FaGift,
  FaVideo,
  FaRing,
  FaChevronLeft,
  FaChevronRight,
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

const ORNAMENT = "/dummy/ornamen-bunga.png";
const THE_BRIDE = "/dummy/the-bride.png";
const THE_GROOM = "/dummy/the-groom.png";
const BCA_LOGO = "/dummy/bca-white.png";

const DEFAULT_GALLERY = [
  "/dummy/gallery-1.jpg",
  "/dummy/gallery-2.jpg",
  "/dummy/gallery-3.jpg",
  "/dummy/gallery-4.jpg",
];

/* ── Scroll-triggered reveal animation (matching Eksklusif-9 fadeInUp / zoomIn) ── */
function Reveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "fadeInUp" | "zoomIn" | "fadeIn";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hiddenClass =
    variant === "zoomIn"
      ? "opacity-0 scale-90"
      : variant === "fadeIn"
      ? "opacity-0"
      : "opacity-0 translate-y-7";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all ease-out will-change-transform ${
        visible ? "duration-700 opacity-100 translate-y-0 scale-100" : `duration-200 ${hiddenClass}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Reusable heading: ornament + serif word + script word (overlapping) ── */
function SectionTitle({
  top,
  bottom,
  light = false,
  ornament = true,
  upper = false,
}: {
  top: string;
  bottom: string;
  light?: boolean;
  ornament?: boolean;
  upper?: boolean;
}) {
  return (
    <Reveal variant="fadeInUp" className="flex flex-col items-center text-center">
      {ornament && <img src={ORNAMENT} alt="" className="w-[42px] mb-1 select-none" />}
      <h2
        className={`font-playfair leading-none ${upper ? "text-[30px] tracking-wide" : "text-[32px]"} ${
          light ? "text-white" : "text-[#383838]"
        }`}
      >
        {top}
      </h2>
      <span
        className={`font-alex text-[26px] leading-none -mt-1 ml-10 ${light ? "text-white" : "text-[#928573]"}`}
      >
        {bottom}
      </span>
    </Reveal>
  );
}

export default function MainContent({ name, config: dynamicConfig, isPreview = false }: MainContentProps) {
  const cfg = dynamicConfig || defaultConfig;

  const [isOpen, setIsOpen] = useState(isPreview);
  const [showOpenBtn, setShowOpenBtn] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAmplop, setShowAmplop] = useState(false);
  const [showKado, setShowKado] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formName, setFormName] = useState(name && name !== "Tamu Undangan" ? name : "");
  const [formAttendance, setFormAttendance] = useState("hadir");
  const [formGuests, setFormGuests] = useState(1);
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEditingWish, setIsEditingWish] = useState(false);
  const [rsvpNotice, setRsvpNotice] = useState<string | null>(null);
  const [showRsvpPopup, setShowRsvpPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  const rawGallery = Array.isArray(cfg.galleryImages) ? cfg.galleryImages.filter(Boolean) : [];
  const galleryImages: string[] = rawGallery.length > 0 ? rawGallery : DEFAULT_GALLERY;

  const heroImage =
    cfg.slideImages?.slide1 || cfg.coverImage || "/dummy/cover-1.jpg";
  const leftHeroImage =
    cfg.slideImages?.sideImage || cfg.slideImages?.slide10 || heroImage;
  const closingImage = cfg.slideImages?.slide9 || "/dummy/cover-2.jpg";
  const bridePhoto = cfg.bridePhoto || cfg.slideImages?.slide2 || "/dummy/wanita.jpg";
  const groomPhoto = cfg.groomPhoto || cfg.slideImages?.slide3 || "/dummy/pria.jpg";
  const storyImages = [
    cfg.timeline_1_image || cfg.slideImages?.slide4 || "/dummy/story-1.jpg",
    cfg.timeline_2_image || cfg.slideImages?.slide5 || "/dummy/story-1.jpg",
    cfg.timeline_3_image || cfg.slideImages?.slide6 || "/dummy/story-2.jpg",
    cfg.timeline_4_image || "/dummy/story-1.jpg",
    cfg.timeline_5_image || "/dummy/story-2.jpg",
  ];
  const prewedBg = cfg.slideImages?.slide7 || galleryImages[0] || "/dummy/gallery-1.jpg";

  // Date helpers (English format on frontend only)
  const eventDate = new Date(cfg.eventDate || "2026-12-13T09:00:00");
  const dayName = eventDate.toLocaleDateString("en-US", { weekday: "long" });
  const dayNum = eventDate.getDate();
  const monthYear = eventDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const fullDate = `${dayName}, ${dayNum} ${monthYear}`;

  const toTitleCase = (str: string) =>
    (str || "")
      .toLowerCase()
      .split(" ")
      .map((w) => (w === "&" || w === "dan" ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ");
  const couple = toTitleCase(cfg.coupleNames || "Elia & Juan");

  /* Countdown */
  useEffect(() => {
    const target = eventDate.getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.eventDate]);

  /* Wishes & Check existing RSVP */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/get?page=1&limit=100");
        if (res.ok) {
          const data = await res.json();
          setWishes(data.wishes || []);
        }
      } catch {
        /* ignore */
      }
      if (name && name !== "Tamu Undangan") {
        try {
          const chk = await fetch(`/api/check-wish?name=${encodeURIComponent(name)}`);
          if (chk.ok) {
            const cData = await chk.json();
            if (cData.exists && cData.wish) {
              setFormAttendance((cData.wish.attendance || "hadir").toLowerCase());
              setFormGuests(cData.wish.guests || 1);
              setFormMessage(cData.wish.message || "");
              setHasSubmitted(true);
            }
          }
        } catch {
          /* ignore */
        }
      }
    })();
  }, [name]);

  /* Lightbox keyboard navigation */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((idx) => (idx === null ? null : (idx - 1 + galleryImages.length) % galleryImages.length));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((idx) => (idx === null ? null : (idx + 1) % galleryImages.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, galleryImages.length]);

  /* Popup reminder to fill RSVP after opening invitation */
  useEffect(() => {
    if (!isOpen || isPreview || hasSubmitted || popupDismissed) {
      if (hasSubmitted) setShowRsvpPopup(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowRsvpPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, isPreview, hasSubmitted, popupDismissed]);

  const handleOpen = () => {
    setIsOpen(true);
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;
    setIsSubmitting(true);
    const payload = {
      name: formName.trim(),
      attendance: formAttendance,
      guests: formAttendance === "hadir" ? Number(formGuests) || 1 : 0,
      message: formMessage.trim(),
    };
    const local: Wish = { _id: `temp_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* ignore – still show locally */
    } finally {
      setWishes((prev) => [local, ...prev.filter((w) => w.name.toLowerCase() !== payload.name.toLowerCase())]);
      setHasSubmitted(true);
      setIsEditingWish(false);
      setRsvpNotice("Terima kasih! Konfirmasi & ucapan Anda telah tersimpan.");
      setTimeout(() => setRsvpNotice(null), 4000);
      setIsSubmitting(false);
    }
  };

  const countHadir = wishes.filter((w) => w.attendance === "hadir").length;
  const countTidak = wishes.filter((w) => w.attendance === "tidak_hadir").length;
  const countRagu = wishes.filter((w) => w.attendance !== "hadir" && w.attendance !== "tidak_hadir").length;

  const banks: { bankName: string; accountNumber: string; accountHolderName: string }[] =
    cfg.weddingGift?.bankAccounts?.length
      ? cfg.weddingGift.bankAccounts
      : [
          { bankName: "BCA", accountNumber: "5110127610", accountHolderName: "Elia Kristiawati" },
          { bankName: "Mandiri", accountNumber: "1410022533053", accountHolderName: "Adriel Juan Ardika" },
        ];

  const btn =
    "inline-flex items-center justify-center gap-1.5 bg-[#928573] hover:bg-[#7d7262] text-white font-combo text-[13px] px-4 py-1.5 rounded-[5px] shadow-sm transition";

  const countdownBoxes = [
    { v: timeLeft.days, l: "Hari" },
    { v: timeLeft.hours, l: "Jam" },
    { v: timeLeft.minutes, l: "Menit" },
    { v: timeLeft.seconds, l: "Detik" },
  ];

  /* Event card */
  const EventCard = ({
    title,
    sub,
    time,
    place,
    detail,
    maps,
    bandTop,
  }: {
    title: string;
    sub: string;
    time: string;
    place: string;
    detail?: string;
    maps?: string;
    bandTop?: boolean;
  }) => (
    <div className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] flex flex-col text-center w-full">
      {bandTop && (
        <div className="bg-[#928573] text-white font-alex text-[15px] py-1">{couple}</div>
      )}
      <div className="px-3 pt-5 pb-4 flex flex-col items-center flex-1">
        <h3 className="font-playfair text-[26px] text-[#383838] leading-none">{title}</h3>
        <span className="font-alex text-[22px] text-[#928573] leading-none -mt-1 ml-8">{sub}</span>
        <p className="font-playfair text-[15px] text-[#5A5A5A] mt-3 capitalize">{dayName}</p>
        <div className="w-24 h-px bg-[#c9c0b3] my-1" />
        <p className="font-playfair text-[34px] text-[#5A5A5A] leading-none">{dayNum}</p>
        <div className="w-24 h-px bg-[#c9c0b3] my-1" />
        <p className="font-playfair text-[15px] text-[#5A5A5A]">{monthYear}</p>
        <p className="font-lligat text-[12px] text-[#928573] mt-3">{time}</p>
        <p className="font-lligat text-[12px] text-[#383838] font-semibold leading-tight">{place}</p>
        {detail && <p className="font-lligat text-[10px] text-[#7D7D7D] leading-tight mt-1 px-1">{detail}</p>}
        {maps && (
          <a href={maps} target="_blank" rel="noreferrer" className={`${btn} mt-auto pt-1.5 !text-[11px] !px-3 !py-1`}>
            <FaMapMarkerAlt /> Lokasi Acara
          </a>
        )}
      </div>
      {!bandTop && (
        <div className="bg-[#928573] text-white font-alex text-[15px] py-1">{couple}</div>
      )}
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-white text-[#383838] font-lligat relative overflow-hidden">
      <audio ref={audioRef} src={cfg.musicPath || "/music/wedding_song.mp3"} loop preload="auto" />

      {/* ══════════ LIGHTBOX WITH NAVIGATOR ══════════ */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <span className="absolute top-5 left-6 text-white/80 text-xs font-mono">
            {lightboxIndex + 1} / {galleryImages.length}
          </span>
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-6 text-white text-2xl hover:text-white/75"
            aria-label="Tutup"
          >
            <FaTimes />
          </button>
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
              aria-label="Sebelumnya"
            >
              <FaChevronLeft />
            </button>
          )}
          <img
            src={galleryImages[lightboxIndex]}
            alt={`Gallery ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[88vw] max-h-[85vh] object-contain rounded shadow-2xl"
          />
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
              }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
              aria-label="Berikutnya"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}

      {/* ══════════ RSVP POPUP REMINDER ══════════ */}
      {showRsvpPopup && !hasSubmitted && (
        <div className="fixed bottom-16 right-0 left-0 md:left-auto md:w-[430px] z-[55] px-4 pointer-events-none animate-fadeIn">
          <div className="pointer-events-auto bg-white border-2 border-[#928573] rounded-xl shadow-2xl p-4 relative text-center">
            <button
              type="button"
              onClick={() => {
                setShowRsvpPopup(false);
                setPopupDismissed(true);
              }}
              className="absolute top-2.5 right-3 text-[#7D7D7D] hover:text-[#383838] text-sm"
              aria-label="Tutup Popup"
            >
              <FaTimes />
            </button>
            <p className="font-playfair text-[15px] font-semibold text-[#383838] mb-1">
              Konfirmasi Kehadiran
            </p>
            <p className="font-lligat text-[12px] text-[#5A5A5A] leading-snug whitespace-pre-line pr-2">
              {(cfg.popupTemplate ||
                "Hai {nama}! Terima kasih telah membuka undangan kami. Mohon kesediaannya untuk mengisi ucapan doa dan konfirmasi kehadiran pada form RSVP di bawah ya!"
              ).replace(/\{nama\}/gi, name && name !== "Tamu Undangan" ? name : "Bapak/Ibu/Saudara/i")}
            </p>
            <button
              type="button"
              onClick={() => {
                setShowRsvpPopup(false);
                setPopupDismissed(true);
                scrollTo("section-rsvp");
              }}
              className={`${btn} mt-3 !text-[12px] !px-4 !py-1.5`}
            >
              <FaCommentDots /> Isi RSVP &amp; Ucapan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ══════════ COVER (BEFORE OPEN — FULLSCREEN BOTH DESKTOP & MOBILE) ══════════ */}
      {!isPreview && (() => {
        const pos = cfg.sideBannerPosition || "bottom";
        const coverAlign =
          pos === "top"
            ? "md:items-center md:justify-start md:pt-16 md:text-center"
            : pos === "left"
            ? "md:items-start md:justify-center md:pl-24 md:text-left"
            : pos === "right"
            ? "md:items-end md:justify-center md:pr-24 md:text-right"
            : pos === "center"
            ? "md:items-center md:justify-center md:text-center"
            : "md:items-center md:justify-end md:pb-16 md:text-center";
        const ctaAlign =
          pos === "left" ? "md:items-start" : pos === "right" ? "md:items-end" : "md:items-center";

        return (
          <div
            className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-12 text-center ${coverAlign} text-white px-6 select-none overflow-hidden transition-opacity duration-300 ease-out ${
              isOpen ? "opacity-0 md:hidden pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Background: Side Banner on desktop/landscape, Hero Cover on mobile */}
            <div
              className="absolute inset-0 bg-cover bg-center md:hidden"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center hidden md:block"
              style={{ backgroundImage: `url(${leftHeroImage})` }}
            />
            <div className="absolute inset-0 bg-black/35" />
            {/* Subtle floating sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[
                { top: "18%", left: "22%", delay: "0s", size: "w-1 h-1" },
                { top: "28%", left: "74%", delay: "0.7s", size: "w-1.5 h-1.5" },
                { top: "42%", left: "35%", delay: "1.3s", size: "w-1 h-1" },
                { top: "55%", left: "65%", delay: "0.4s", size: "w-1 h-1" },
                { top: "68%", left: "28%", delay: "1.1s", size: "w-1.5 h-1.5" },
                { top: "75%", left: "78%", delay: "0.2s", size: "w-1 h-1" },
                { top: "33%", left: "52%", delay: "1.6s", size: "w-1 h-1" },
                { top: "62%", left: "48%", delay: "0.9s", size: "w-1 h-1" },
              ].map((dot, idx) => (
                <span
                  key={idx}
                  className={`absolute ${dot.size} rounded-full bg-white/75 animate-pulse`}
                  style={{ top: dot.top, left: dot.left, animationDelay: dot.delay, animationDuration: "2.4s" }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <p className="font-playfair text-[14px] animate-fadeIn">The Wedding Of</p>
              <h1 className="font-alex text-[48px] md:text-[64px] leading-tight drop-shadow min-h-[64px] md:min-h-[82px]">
                <TypeAnimation
                  sequence={[
                    couple,
                    400,
                    () => setShowOpenBtn(true),
                  ]}
                  wrapper="span"
                  speed={25}
                  cursor={false}
                  repeat={0}
                />
              </h1>
              <p
                className={`font-playfair text-[13px] capitalize transition-opacity duration-700 ${
                  showOpenBtn ? "opacity-100" : "opacity-0"
                }`}
              >
                {fullDate}
              </p>
            </div>

            <div
              className={`relative z-10 flex flex-col items-center ${ctaAlign} transition-all duration-700 ${
                showOpenBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <p className="font-playfair text-[13px]">Dear</p>
              <p className="font-lligat text-lg font-semibold mt-1 mb-4">{name || "Tamu Undangan"}</p>
              <button onClick={handleOpen} className={btn}>
                <FaEnvelopeOpen /> Buka Undangan
              </button>
            </div>
          </div>
        );
      })()}

      {/* ══════════ LEFT PANE (DESKTOP / LANDSCAPE) ══════════ */}
      {(() => {
        const pos = cfg.sideBannerPosition || "bottom";
        const containerAlign =
          pos === "top"
            ? "items-center justify-start pt-16 text-center"
            : pos === "left"
            ? "items-start justify-center pl-14 text-left"
            : pos === "right"
            ? "items-end justify-center pr-14 text-right"
            : pos === "center"
            ? "items-center justify-center text-center"
            : "items-center justify-end pb-16 text-center";
        const countdownAlign =
          pos === "left" ? "justify-start" : pos === "right" ? "justify-end" : "justify-center";
        const verseMargin =
          pos === "left" ? "mr-auto" : pos === "right" ? "ml-auto" : "mx-auto";

        return (
          <div
            className={`hidden md:flex flex-1 h-screen relative overflow-hidden text-white select-none flex-col transition-all duration-700 ease-out ${containerAlign}`}
            style={{ backgroundImage: `url(${leftHeroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30" />
            <div className="relative z-10 px-8 max-w-2xl">
              <p className="font-playfair text-sm tracking-[0.3em] uppercase text-white/90">The Wedding Of</p>
              <h1 className="font-alex text-7xl lg:text-8xl leading-tight drop-shadow-lg my-2">{couple}</h1>
              <p className="font-playfair text-base lg:text-lg text-white/90 capitalize">{fullDate}</p>
              <p className={`font-playfair italic text-sm text-white/85 mt-5 leading-relaxed max-w-lg whitespace-pre-line ${verseMargin}`}>
                {cfg.bibleVerseContent ||
                  '"Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia."'}
              </p>
              {cfg.bibleVerse && (
                <p className="font-lligat text-xs tracking-widest text-white/75 mt-1.5">{cfg.bibleVerse}</p>
              )}
              <div className={`flex ${countdownAlign} gap-3 mt-8`}>
                {countdownBoxes.map((b) => (
                  <div key={b.l} className="bg-[#928573]/80 rounded-md w-[72px] py-2.5 text-center backdrop-blur-sm">
                    <span className="block text-2xl font-semibold leading-none">{b.v}</span>
                    <span className="block text-[11px] mt-1">{b.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════ RIGHT PANE: INVITATION ══════════ */}
      <div
        ref={scrollRef}
        className={`w-full h-screen ${
          isOpen
            ? "md:w-[430px] md:min-w-[430px] md:opacity-100 overflow-y-auto"
            : "md:w-0 md:min-w-0 md:opacity-0 overflow-hidden"
        } overflow-x-hidden scroll-smooth relative bg-white md:shadow-[-8px_0_30px_rgba(0,0,0,0.25)] transition-all duration-700 ease-out`}
      >
        {/* ─── 1. HERO ─── */}
        <section
          id="section-countdown"
          className="relative h-screen min-h-[600px] flex flex-col items-center justify-between text-white text-center pt-24 pb-28"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <span id="section-home" className="absolute top-0" />
          <div className="absolute inset-0 bg-black/15" />
          <Reveal variant="fadeInUp" className="relative z-10">
            <p className="font-playfair text-[13px] drop-shadow">The Wedding Of</p>
            <h1 className="font-alex text-[40px] leading-tight drop-shadow-md">{couple}</h1>
            <p className="font-playfair text-[12px] drop-shadow capitalize">{fullDate}</p>
          </Reveal>
          <Reveal variant="fadeInUp" delay={150} className="relative z-10 flex gap-2">
            {countdownBoxes.map((b) => (
              <div key={b.l} className="bg-[#928573]/85 rounded-[5px] w-[54px] py-1.5 text-center">
                <span className="block text-[18px] font-semibold leading-none">{b.v}</span>
                <span className="block text-[10px] mt-0.5">{b.l}</span>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ─── 2. OUR WEDDING + photo strip ─── */}
        <section className="bg-white pt-10 pb-6 text-center">
          <Reveal variant="fadeInUp">
            <img src={ORNAMENT} alt="" className="w-[42px] mx-auto mb-1" />
            <h2 className="font-playfair text-[24px] text-[#383838] leading-none">Our</h2>
            <h2 className="font-playfair text-[34px] text-[#383838] leading-tight">Wedding</h2>
          </Reveal>
          <Reveal variant="fadeInUp" delay={120}>
            <p className="font-playfair italic text-[12px] text-[#383838] px-6 mt-5 leading-snug">
              Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara
              pernikahan kami
            </p>
          </Reveal>
          <Reveal variant="fadeIn" delay={200} className="overflow-hidden mt-3">
            <div className="flex gap-1 w-max animate-marquee">
              {[...galleryImages, ...galleryImages].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-[82px] h-[120px] object-cover rounded-md"
                />
              ))}
            </div>
          </Reveal>
        </section>

        {/* ─── 3. THE BRIDE ─── */}
        <section id="section-groomBride" className="bg-white pt-4">
          <div className="flex items-end">
            <Reveal variant="fadeInUp" className="w-1/2 flex flex-col items-center text-center px-3 pb-16">
              <span className="font-madi text-[44px] text-[#928573] leading-none">
                {cfg.brideNickName || "Elia"}
              </span>
              <p className="font-lligat text-[15px] text-[#383838] font-semibold mt-3">{cfg.bride}</p>
              <div className="w-full h-px bg-[#c9c0b3] my-2" />
              <p className="font-lligat text-[13px] text-[#7D7D7D] leading-tight whitespace-pre-line">
                {cfg.brideBio}
              </p>
              <div className="w-full h-px bg-[#c9c0b3] my-2" />
              {cfg.brideInstagram && (
                <a
                  href={`https://instagram.com/${cfg.brideInstagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btn} !text-[11px] !px-2.5 !py-1 mt-1`}
                >
                  <FaInstagram /> @{cfg.brideInstagram.replace("@", "")}
                </a>
              )}
            </Reveal>
            <Reveal variant="zoomIn" delay={120} className="w-1/2 flex flex-col items-center pr-2">
              <img src={THE_BRIDE} alt="The Bride" className="w-[90%] -mb-1" />
              <img
                src={bridePhoto}
                alt={cfg.bride}
                className="w-full h-[270px] object-cover object-top rounded-t-full"
              />
            </Reveal>
          </div>
          <div className="h-10 bg-[#E1D6C7]" />
        </section>

        {/* ─── 4. THE GROOM ─── */}
        <section className="bg-white pt-4">
          <div className="flex items-start">
            <Reveal variant="zoomIn" className="w-1/2 flex flex-col items-center pl-2">
              <img src={THE_GROOM} alt="The Groom" className="w-[90%] -mb-1" />
              <img
                src={groomPhoto}
                alt={cfg.groom}
                className="w-full h-[270px] object-cover object-top rounded-t-full"
              />
            </Reveal>
            <Reveal variant="fadeInUp" delay={120} className="w-1/2 flex flex-col items-center text-center px-3 pt-10">
              <span className="font-madi text-[44px] text-[#928573] leading-none">
                {cfg.groomNickName || "Juan"}
              </span>
              <p className="font-lligat text-[15px] text-[#383838] font-semibold mt-3">{cfg.groom}</p>
              <div className="w-full h-px bg-[#c9c0b3] my-2" />
              <p className="font-lligat text-[13px] text-[#7D7D7D] leading-tight whitespace-pre-line">
                {cfg.groomBio}
              </p>
              <div className="w-full h-px bg-[#c9c0b3] my-2" />
              {cfg.groomInstagram && (
                <a
                  href={`https://instagram.com/${cfg.groomInstagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${btn} !text-[11px] !px-2.5 !py-1 mt-1`}
                >
                  <FaInstagram /> @{cfg.groomInstagram.replace("@", "")}
                </a>
              )}
            </Reveal>
          </div>
        </section>

        {/* ─── 5. SAVE THE DATE ─── */}
        <section id="section-events" className="bg-[#E1D6C7] pt-8 pb-10 px-3">
          <SectionTitle top="SAVE" bottom="The Date" upper />
          <div className="grid grid-cols-2 gap-3 mt-6 items-stretch">
            {cfg.holyMatrimony?.enabled !== false && (
              <Reveal variant="fadeInUp" delay={100} className="flex">
                <EventCard
                  title="Pemberkatan"
                  sub="Nikah"
                  time={cfg.holyMatrimony?.time || "Pukul 09.00 WIB"}
                  place={cfg.holyMatrimony?.place || "GMAHK Gresik"}
                  detail={cfg.holyMatrimony?.place_details}
                  maps={cfg.holyMatrimony?.googleMapsLink}
                />
              </Reveal>
            )}
            {cfg.weddingReception?.enabled !== false && (
              <Reveal variant="fadeInUp" delay={200} className="flex">
                <EventCard
                  title="Resepsi"
                  sub="Nikah"
                  time={cfg.weddingReception?.time || "Pukul 13.00 WIB"}
                  place={cfg.weddingReception?.place || "Gedung Dakwah Muhammadiyah Gresik"}
                  detail={cfg.weddingReception?.place_details}
                  maps={cfg.weddingReception?.googleMapsLink}
                  bandTop
                />
              </Reveal>
            )}
          </div>
        </section>

        {/* ─── 6. LOVE STORY ─── */}
        {cfg.loveJourneyEnabled !== false && (
          <section id="section-loveJourney" className="bg-white pt-10 pb-8 px-6">
            <SectionTitle top="Love" bottom="Story" />
            <div className="flex flex-col gap-7 mt-6">
              {Array.from({ length: Math.min(cfg.timelineCount || 3, 5) }, (_, idx) => idx + 1)
                .filter((n) => cfg[`timeline_${n}`] || cfg[`timeline_${n}_content`])
                .map((n, idx) => (
                  <Reveal key={n} variant="fadeInUp" delay={idx * 100} className="flex flex-col items-center text-center">
                    <img
                      src={storyImages[n - 1]}
                      alt={cfg[`timeline_${n}`] || `Story ${n}`}
                      className="w-[220px] h-[145px] object-cover rounded-tl-[55px] rounded-tr-[55px] rounded-bl-[55px] rounded-br-none shadow-sm"
                    />
                    <h4 className="font-alex text-[28px] text-[#928573] mt-2.5 leading-tight">
                      {cfg[`timeline_${n}`]}
                    </h4>
                    <p className="font-lligat text-[13px] text-[#383838] leading-snug mt-1 max-w-[260px]">
                      {cfg[`timeline_${n}_content`]}
                    </p>
                  </Reveal>
                ))}
            </div>
          </section>
        )}

        {/* ─── 7. MOMENT GALLERY ─── */}
        <section id="section-media" className="bg-white pt-8 pb-10 px-2">
          <SectionTitle top="Moment" bottom="Gallery" />
          {(() => {
            const count = galleryImages.length;
            const gridCols = count > 6 ? "grid-cols-3 gap-1.5" : count > 4 ? "grid-cols-2 gap-1.5" : "grid-cols-2 gap-2";
            const itemHeight = count > 4 ? "h-[145px]" : "h-[210px]";
            return (
              <div className={`grid ${gridCols} mt-4`}>
                {galleryImages.map((src, i) => (
                  <Reveal key={i} variant="zoomIn" delay={(i % 4) * 80}>
                    <img
                      src={src}
                      alt={`Gallery ${i + 1}`}
                      onClick={() => setLightboxIndex(i)}
                      className={`w-full ${itemHeight} object-cover rounded-md cursor-pointer hover:opacity-90 transition`}
                    />
                  </Reveal>
                ))}
              </div>
            );
          })()}
        </section>

        {/* ─── 8. VIDEO PREWEDDING ─── */}
        {cfg.prewedding?.enabled !== false && (
          <section
            className="relative py-12 text-center"
            style={{ backgroundImage: `url(${prewedBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-[#928573]/75" />
            <div className="relative z-10">
              <SectionTitle top="Video" bottom="Prewedding" light ornament={false} />
              {cfg.prewedding?.link && (() => {
                const raw = String(cfg.prewedding.link).trim();
                if (raw.includes("<iframe")) {
                  return (
                    <Reveal variant="zoomIn" delay={120}>
                      <div
                        className="mx-4 mt-6 aspect-video bg-black/30 rounded-lg overflow-hidden shadow-lg [&_iframe]:w-full [&_iframe]:h-full"
                        dangerouslySetInnerHTML={{ __html: raw }}
                      />
                    </Reveal>
                  );
                }
                const ytMatch = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                const videoId = ytMatch ? ytMatch[1] : /^[a-zA-Z0-9_-]{11}$/.test(raw) ? raw : null;
                const embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : raw;
                return (
                  <Reveal variant="zoomIn" delay={120}>
                    <div className="mx-4 mt-6 aspect-video bg-black/30 rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        src={embedSrc}
                        title="Video Prewedding"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </Reveal>
                );
              })()}
              {cfg.prewedding?.detail && (
                <Reveal variant="fadeInUp" delay={200}>
                  <p className="font-lligat text-[12px] text-white/90 mt-3 px-6">{cfg.prewedding.detail}</p>
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* ─── 9. LIVE STREAMING ─── */}
        {cfg.livestreaming?.enabled !== false && (
          <section className="bg-[#ECECEC] py-8 px-6 text-center">
            <Reveal variant="fadeInUp">
              <FaInstagram className="mx-auto text-[34px] text-[#383838]" />
              <h3 className="font-combo text-[17px] text-[#5A5A5A] mt-2">Live Streaming</h3>
              <p className="font-lligat text-[12px] text-[#383838] leading-tight mt-2">
                Temui kami secara virtual untuk menyaksikan acara pernikahan kami yang akan disiarkan langsung melalui
                akun instagram kami berikut ini.
              </p>
              <a href={cfg.livestreaming?.link || "#"} target="_blank" rel="noreferrer" className={`${btn} mt-3`}>
                <FaVideo /> Live Streaming
              </a>
              <p className="font-lligat text-[12px] text-[#383838] mt-3 leading-tight">
                {cfg.livestreaming?.detail}
                {cfg.livestreaming?.time && (
                  <>
                    <br />
                    Pukul {cfg.livestreaming.time}
                  </>
                )}
              </p>
            </Reveal>
          </section>
        )}

        {/* ─── 10. WEDDING GIFT ─── */}
        <section id="section-weddingGift" className="bg-white pt-10 pb-10 px-6 text-center">
          <SectionTitle top="Wedding" bottom="Gift" />
          <Reveal variant="fadeInUp" delay={120}>
            <p className="font-lligat text-[13px] text-[#383838] leading-tight mt-4 max-w-[290px] mx-auto">
              Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda
              kasih Anda, Anda dapat memberi kado secara cashless.
            </p>
          </Reveal>

          <button onClick={() => setShowAmplop((s) => !s)} className={`${btn} mt-4`}>
            <FaEnvelope /> Amplop Online
          </button>
          {showAmplop && (
            <div className="flex flex-col gap-3 mt-4 animate-fadeIn">
              {banks.map((b, i) => (
                <div key={i} className="bg-[#928573] text-white rounded-lg py-5 px-4 shadow">
                  {b.bankName.toUpperCase() === "BCA" ? (
                    <img src={BCA_LOGO} alt="BCA" className="h-7 mx-auto mb-3" />
                  ) : (
                    <p className="font-playfair italic font-semibold text-xl mb-3">{b.bankName}</p>
                  )}
                  <p className="font-lligat text-[18px] tracking-widest">{b.accountNumber}</p>
                  <button
                    onClick={() => handleCopy(b.accountNumber, `bank-${i}`)}
                    className="inline-flex items-center gap-1.5 bg-white text-[#928573] text-[11px] font-combo px-3 py-1 rounded mt-2"
                  >
                    {copiedKey === `bank-${i}` ? <FaCheck /> : <FaCopy />}
                    {copiedKey === `bank-${i}` ? "Tersalin!" : "Salin No. Rekening"}
                  </button>
                  <p className="font-lligat text-[12px] mt-2">A/n {b.accountHolderName}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <a
              href={`https://wa.me/628993706640?text=${encodeURIComponent(
                `Halo, saya sudah mengirimkan amplop online untuk pernikahan ${couple}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className={btn}
            >
              <FaWhatsapp /> Konfirmasi Amplop
            </a>
          </div>

          <div className="flex items-center gap-2 my-5 max-w-[280px] mx-auto">
            <div className="flex-1 h-px bg-[#c9c0b3]" />
            <FaGift className="text-[#c9c0b3]" />
            <div className="flex-1 h-px bg-[#c9c0b3]" />
          </div>

          <button onClick={() => setShowKado((s) => !s)} className={btn}>
            <FaGift /> Kirim Kado
          </button>
          {showKado && (
            <div className="bg-[#928573] text-white rounded-lg py-5 px-4 shadow mt-4 animate-fadeIn">
              <p className="font-playfair text-[15px]">Kediaman Mempelai Wanita</p>
              <p className="font-lligat text-[13px] mt-1">{cfg.giftAddress || "Kabupaten Gresik, Jawa Timur"}</p>
              <button
                onClick={() => handleCopy(cfg.giftAddress || "Kabupaten Gresik, Jawa Timur", "alamat")}
                className="inline-flex items-center gap-1.5 bg-white text-[#928573] text-[11px] font-combo px-3 py-1 rounded mt-2"
              >
                {copiedKey === "alamat" ? <FaCheck /> : <FaCopy />}
                {copiedKey === "alamat" ? "Tersalin!" : "Salin Alamat Kirim Kado"}
              </button>
              <p className="font-lligat text-[12px] mt-2">A/n {cfg.bride}</p>
            </div>
          )}
        </section>

        {/* ─── 11. UCAPAN & DO'A ─── */}
        <section id="section-rsvp" className="bg-[#B3A99C] pt-10 pb-12 px-4">
          <SectionTitle top="Ucapan" bottom="& Do'a" ornament={false} light />
          <div className="bg-[#F0F0F0] rounded-lg shadow-md mt-5 overflow-hidden">
            <div className="p-4 text-center border-b border-[#ddd]">
              <p className="text-[12px] font-semibold text-[#383838]">{wishes.length} Comments</p>
              <div className="flex justify-center gap-2 mt-2">
                {[
                  { n: countHadir, l: "Hadir", c: "bg-[#3D9A62]" },
                  { n: countTidak, l: "Tidak hadir", c: "bg-[#d90a11]" },
                  { n: countRagu, l: "Masih Ragu", c: "bg-[#d7a916]" },
                ].map((s) => (
                  <div key={s.l} className={`${s.c} text-white rounded w-[78px] py-2`}>
                    <span className="block text-[15px] font-bold leading-none">{s.n}</span>
                    <span className="block text-[10px] mt-1">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {rsvpNotice && (
              <div className="mx-4 mt-3 bg-[#3D9A62] text-white text-[11px] px-3 py-2 rounded text-center">
                {rsvpNotice}
              </div>
            )}

            {hasSubmitted && !isEditingWish ? (
              <div className="p-4 border-b border-[#ddd] text-center space-y-2">
                <p className="text-[12px] font-semibold text-[#383838]">
                  Terima kasih, {formName}!
                </p>
                <p className="text-[11px] text-[#5A5A5A]">
                  Status:{" "}
                  <strong className="text-[#383838]">
                    {formAttendance === "hadir"
                      ? `Hadir (${formGuests} Orang)`
                      : formAttendance === "tidak_hadir"
                      ? "Tidak Hadir"
                      : "Masih Ragu"}
                  </strong>
                </p>
                {formMessage && (
                  <p className="text-[11px] italic text-[#5A5A5A] bg-white px-3 py-2 rounded border border-[#e3e3e3]">
                    &ldquo;{formMessage}&rdquo;
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingWish(true)}
                  className={`${btn} !text-[11px] !px-3 !py-1 mt-1`}
                >
                  Ubah Konfirmasi / Ucapan
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitWish} className="p-4 flex flex-col gap-2 border-b border-[#ddd]">
                <input
                  type="text"
                  placeholder="Nama"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  readOnly={Boolean(name && name !== "Tamu Undangan") || isEditingWish}
                  required
                  className={`w-full px-3 py-2 rounded border border-[#ccc] text-[12px] outline-none focus:border-[#928573] ${
                    (name && name !== "Tamu Undangan") || isEditingWish ? "bg-[#e7e7e7] text-[#5A5A5A]" : "bg-white"
                  }`}
                />
                <select
                  value={formAttendance}
                  onChange={(e) => setFormAttendance(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#ccc] bg-white text-[12px] outline-none focus:border-[#928573]"
                >
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Tidak Hadir</option>
                  <option value="masih_ragu">Masih Ragu</option>
                </select>
                {formAttendance === "hadir" && (
                  <select
                    value={formGuests}
                    onChange={(e) => setFormGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-[#ccc] bg-white text-[12px] outline-none focus:border-[#928573]"
                  >
                    {[1, 2].map((g) => (
                      <option key={g} value={g}>
                        Jumlah Tamu: {g} Orang
                      </option>
                    ))}
                  </select>
                )}
                <textarea
                  placeholder="Ucapan & Doa"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded border border-[#ccc] bg-white text-[12px] outline-none focus:border-[#928573] resize-none"
                />
                <div className="flex gap-2 mt-1">
                  {isEditingWish && (
                    <button
                      type="button"
                      onClick={() => setIsEditingWish(false)}
                      className="px-4 py-2 rounded-[5px] border border-[#ccc] bg-white text-[#5A5A5A] text-[12px]"
                    >
                      Batal
                    </button>
                  )}
                  <button type="submit" disabled={isSubmitting} className={`${btn} flex-1 !py-2`}>
                    {isSubmitting ? "Mengirim..." : isEditingWish ? "Simpan Perubahan" : "Kirim"}
                  </button>
                </div>
              </form>
            )}

            <div className="max-h-80 overflow-y-auto">
              {wishes.length === 0 ? (
                <p className="text-[11px] text-[#7D7D7D] p-4">Belum ada ucapan. Jadilah yang pertama!</p>
              ) : (
                wishes.map((w, i) => (
                  <div key={w._id || i} className="px-4 py-3 border-b border-[#e3e3e3] text-left">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="text-[12px] font-bold text-[#383838]">{w.name}</span>
                      <span
                        className={`text-[9px] text-white px-1.5 py-0.5 rounded ${
                          w.attendance === "hadir"
                            ? "bg-[#3D9A62]"
                            : w.attendance === "tidak_hadir"
                            ? "bg-[#d90a11]"
                            : "bg-[#d7a916]"
                        }`}
                      >
                        {w.attendance === "hadir" ? "Hadir" : w.attendance === "tidak_hadir" ? "Tidak hadir" : "Masih Ragu"}
                      </span>
                      {w.attendance === "hadir" && w.guests ? (
                        <span className="text-[9px] bg-[#e1d6c7] text-[#5A5A5A] px-1.5 py-0.5 rounded">
                          {w.guests} Tamu
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[12px] text-[#5A5A5A] mt-1 leading-snug">{w.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ─── 12. QUOTES (Ayat) ─── */}
        <section className="bg-[#ECECEC] py-8 px-6 text-center">
          <Reveal variant="fadeInUp">
            <h3 className="font-montserrat italic font-light text-[24px] tracking-wide text-[#383838]">QUOTES</h3>
            <p className="font-montserrat italic text-[11px] text-[#383838] leading-snug mt-2 whitespace-pre-line">
              {cfg.bibleVerseContent ||
                '"Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya, sehingga keduanya menjadi satu daging."'}
            </p>
            {cfg.bibleVerse && (
              <p className="font-montserrat text-[10px] text-[#7D7D7D] mt-1.5">({cfg.bibleVerse})</p>
            )}
          </Reveal>
        </section>

        {/* ─── 13. PENUTUP ─── */}
        <section id="section-penutup" className="bg-[#ECECEC] pb-28 text-center">
          <div
            className="relative h-[480px] flex items-end justify-center pb-6"
            style={{ backgroundImage: `url(${closingImage})`, backgroundSize: "cover", backgroundPosition: "center top" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#ECECEC]" />
            <Reveal variant="fadeInUp" className="relative z-10">
              <p className="font-lligat text-[13px] text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Atas kehadiran dan doa restunya,
                <br />
                kami ucapkan terima kasih.
              </p>
            </Reveal>
          </div>
          <Reveal variant="fadeInUp" delay={120}>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-14 h-px bg-[#928573]" />
              <FaRing className="text-[#928573] text-lg" />
              <div className="w-14 h-px bg-[#928573]" />
            </div>
            <p className="font-alex text-[38px] text-[#928573] mt-1">{couple}</p>
          </Reveal>
        </section>
      </div>

      {/* ══════════ BOTTOM NAV (like reference) ══════════ */}
      {isOpen && (
        <nav className="fixed bottom-0 right-0 left-0 md:left-auto md:w-[430px] z-50 flex justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.15)] rounded-t-md flex gap-4 px-4 py-1.5">
            {[
              { icon: <FaHome />, id: "section-home", t: "Home" },
              { icon: <FaUserFriends />, id: "section-groomBride", t: "Mempelai" },
              { icon: <FaCalendarAlt />, id: "section-events", t: "Acara" },
              { icon: <FaImages />, id: "section-media", t: "Galeri" },
              { icon: <FaCommentDots />, id: "section-rsvp", t: "Ucapan" },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                title={n.t}
                className="w-7 h-7 rounded bg-[#E1D6C7] text-[#5A5A5A] text-[12px] flex items-center justify-center hover:bg-[#928573] hover:text-white transition"
              >
                {n.icon}
              </button>
            ))}
            <button
              onClick={toggleMusic}
              title={isPlaying ? "Pause Musik" : "Putar Musik"}
              className="w-7 h-7 rounded bg-[#E1D6C7] text-[#5A5A5A] text-[12px] flex items-center justify-center hover:bg-[#928573] hover:text-white transition"
            >
              {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
