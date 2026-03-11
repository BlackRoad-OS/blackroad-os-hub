import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlackRoad OS",
  description: "The Operating System for Governed AI",
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/apps", label: "Apps" },
  { href: "/repos", label: "Repos" },
  { href: "/agents", label: "Agents" },
  { href: "/fleet", label: "Fleet" },
  { href: "/issues", label: "Issues" },
  { href: "/status", label: "Status" },
  { href: "/docs", label: "Docs" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}>
        <nav className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-bold text-lg gradient-text flex-shrink-0">
              BlackRoad OS
            </Link>
            <div className="flex gap-1 overflow-x-auto">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all whitespace-nowrap"
                >
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <a
                href="https://github.com/BlackRoad-OS"
                target="_blank"
                rel="noopener"
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
