import type { Metadata } from "next";
import { Ovo, Ms_Madi, Great_Vibes, Cormorant_Garamond, Montserrat, Playfair_Display, Alex_Brush, Port_Lligat_Sans, Combo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { config } from "@/lib/config";
import { getDynamicSettings } from "@/lib/dbHelper";

export const dynamic = "force-dynamic";

const legan = localFont({
  src: "./fonts/Legan.woff",
  variable: "--font-legan",
  weight: "100 900",
});

const thesignature = localFont({
  src: "./fonts/Thesignature.ttf",
  variable: "--font-thesignature",
  weight: "100 900",
});

const wonder = localFont({
  src: "./fonts/Wonder.woff",
  variable: "--font-wonder",
  weight: "100 900",
});

const ovo = Ovo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ovo",
});

const dancingScript = Ms_Madi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dancing",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alex",
});

const lligat = Port_Lligat_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lligat",
});

const combo = Combo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-combo",
});

export async function generateMetadata() {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || "https://ejuvitation.vercel.app";
  
  try {
    const settings = await getDynamicSettings();
    const coupleNames = settings?.coupleNames || "ELIA & JUAN";
    const slide10Image = settings?.slideImages?.slide10 || "/slide_9.jpg";
    
    let absoluteImageUrl: string;
    if (slide10Image.startsWith("http")) {
      absoluteImageUrl = slide10Image;
    } else {
      const imagePath = slide10Image.startsWith("/") ? slide10Image : `/${slide10Image}`;
      absoluteImageUrl = `${siteUrl}/_next/image?url=${encodeURIComponent(imagePath)}&w=1200&q=80`;
    }

    return {
      title: `The Wedding of ${coupleNames}`,
      description: `Undangan Pernikahan ${coupleNames}`,
      openGraph: {
        title: `The Wedding of ${coupleNames}`,
        description: `Kami mengundang Anda untuk hadir di acara pernikahan kami.`,
        url: siteUrl,
        siteName: `The Wedding of ${coupleNames}`,
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: `The Wedding of ${coupleNames}`,
          },
        ],
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: "The Wedding of Elia & Juan",
      description: "Undangan Pernikahan Elia & Juan",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body
        className={`bg-[#2b1f17] text-[#3d2b1f] ${ovo.variable} ${thesignature.variable} ${wonder.variable} ${legan.variable} ${dancingScript.variable} ${greatVibes.variable} ${cormorant.variable} ${montserrat.variable} ${playfair.variable} ${alexBrush.variable} ${lligat.variable} ${combo.variable} font-montserrat antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
