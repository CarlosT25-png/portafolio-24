// @ts-nocheck
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import clsx from "clsx";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import Script from "next/script";

const urbanist = Urbanist({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return {
    title: settings.data.meta_title,
    description: settings.data.meta_description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <Script src="/smartlook.js" />
      <body className={clsx(urbanist.className, "relative min-h-screen")}>
        <Header />
        {children}
        <Footer />
        <div className="background-gradient absolute inset-0 -z-50 max-h-screen"></div>
        <div className="pointer-events-none absolute inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
