import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { Heropt } from "@/components/LandingPage/herodraft";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "300", "500", "700", "900"],
  variable: "--font-Roboto"
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${roboto.variable} ${geistMono.variable} antialiased flex `}
      >
        <div className="hidden md:flex border-r-[1px] border-white/18 text-white bg-black h-screen overflow-y-auto w-[100%] md:w-[20%]">
          <Heropt />
        </div>
        <div className="w-[100%] md:w-[80%] overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
