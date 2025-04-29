import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "react-hot-toast";

export const montserrat = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "ACME - Audits",
  description: "ACME, the best solution for companies acquaintance!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow py-20">{children}</main>
            <Toaster position="top-right" />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
