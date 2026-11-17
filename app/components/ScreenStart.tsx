"use client";

import { config as defaultConfig } from "@/lib/config";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

interface ScreenStartProps {
  config?: any;
}

const ScreenStart = ({ config: propConfig }: ScreenStartProps) => {
  const activeConfig = propConfig || defaultConfig;
  const [showScreenStart, setShowScreenStart] = useState(true);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setFadeClass("opacity-100");
    }, 100);

    const fadeOutTimer = setTimeout(() => {
      setFadeClass("opacity-0");
    }, 4500);

    const removeScreenStart = setTimeout(() => {
      setShowScreenStart(false);
    }, 5500);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(removeScreenStart);
    };
  }, []);

  if (!showScreenStart) {
    return null;
  }

  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str.toLowerCase().split(" ").map(w => {
      if (w === "&" || w === "dan" || w === "and") return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(" ");
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#2b1f17] text-white flex flex-col justify-center items-center min-h-screen transition-opacity duration-1000 ${fadeClass} px-6 text-center select-none`}
      style={{
        backgroundImage: "radial-gradient(ellipse at center, rgba(74,52,37,0.85) 0%, rgba(20,15,10,0.95) 100%)",
      }}
    >
      <img
        src="https://web.menujuacara.id/wp-content/uploads/2025/09/ornamen-bunga-cream-1.png"
        alt="Floral Ornament"
        className="w-24 md:w-32 mb-6 opacity-85 animate-pulse"
      />
      <p className="font-legan text-xs uppercase tracking-[0.35em] text-[#d4b896] mb-4">
        The Wedding Of
      </p>
      <h1 className="font-dancing text-4xl md:text-6xl text-white mb-4 tracking-wide">
        <TypeAnimation
          sequence={[
            toTitleCase(activeConfig.coupleNames),
            3000,
          ]}
          wrapper="span"
          speed={30}
          repeat={0}
        />
      </h1>
      <div className="w-16 h-[1px] bg-[#d4b896] my-4 opacity-70"></div>
      <p className="font-ovo text-xs md:text-sm text-[#ede5d5] uppercase tracking-[0.25em]">
        Minggu, 13 Desember 2026
      </p>
    </div>
  );
};

export default ScreenStart;
