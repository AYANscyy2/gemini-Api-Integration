import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
// import { Sidebar } from "@/components/LandingPage/hero";
// import { usePathname } from "next/navigation";
import { UseSideBar } from "@/components/LandingPage/useSideBar";
import { Providers } from "./providers";

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
  title: "WiWiBot | Chat Assistant",
  description: "WiWiBot - Your intelligent chatbot assistant"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname();

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${roboto.variable} ${geistMono.variable} antialiased flex `}
      >
        <UseSideBar />
        <div className="w-[100%]  overflow-x-hidden">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
