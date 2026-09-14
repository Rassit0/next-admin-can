import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";

import { CinematicLoader } from "@/modules/web/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/web/shared/components/site-header";
import { ParticlesBackground } from "@/modules/web/home/components/particles-background";
import { SiteFooter } from "@/modules/web/shared/components/site-footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CAN - Club Atlético Nacional",
  description:
    "Portal institucional del CAN - +1.000 deportistas activos, +50 equipos en competición, escuelas de formación y membresías deportivas.",
  generator: "v0.app",
  openGraph: {
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

import { getInstitution } from "@/modules/web/institutions/actions/institutions.action";
import { notFound } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const institutionRes = await getInstitution();
  
  if (institutionRes.error || !institutionRes.data) {
    notFound();
  }

  // Si necesitamos pasar los datos de institutionRes.data al contexto o header, lo haremos aquí.
  // Por ahora validamos que la API responda.

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable}`}
    >
      <div className="font-sans antialiased bg-background">
        <div className="relative min-h-screen bg-background">
          <CinematicLoader />
          <ParticlesBackground />
          <SiteHeader institution={institutionRes.data} />
          <main className="relative">{children}</main>
          <SiteFooter institution={institutionRes.data} />
        </div>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </div>
    </div>
  );
}
