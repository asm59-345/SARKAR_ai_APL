import type { Metadata } from "next";
import { Roboto, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SarkarAI OS — Futuristic Multi-Agent Governance Platform",
  description: "Autonomous AI Workflow Operating System for Indian Governance and Smart City Administration. Optimised for Lucknow and Uttar Pradesh Municipal Administration.",
  keywords: [
    "AI governance platform", 
    "smart governance India", 
    "Lucknow AI governance", 
    "AI workflow automation", 
    "government AI operating system", 
    "multilingual AI governance", 
    "digital governance platform"
  ],
  openGraph: {
    title: "SarkarAI OS — Indian AI Governance System",
    description: "Autonomous multi-agent platform automating municipal registries and citizen grievances in Lucknow and Uttar Pradesh.",
    type: "website",
    locale: "en_IN",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${ibmPlexSans.variable} dark`}>
      <body className="antialiased min-h-screen bg-[#02030b] text-[#f1f3f9]">
        {children}
      </body>
    </html>
  );
}
