import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootLayout } from "vitnode/next/app/root-layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "VitNode",
  description: "Generated by create next app"
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </RootLayout>
  );
}
