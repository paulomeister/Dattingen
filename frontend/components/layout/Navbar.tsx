"use client";
import Link from "next/link";
import Image from "next/image";
import Dropdowns from "./Dropdowns";
import { useLanguage } from "@/lib/LanguageContext";

export function Navbar() {

  const { t } = useLanguage()

  const navigationLinks: any[] = [
    {
      label: t("navbar.links.home"),
      href: "/",
    },
    {
      label: t("navbar.links.rulesets"),
      href: "/rulesets",
    },
    {
      label: t("navbar.links.myAudits"),
      href: "/progress",
    },
  ];
  return (
    <nav className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md ">
      <div className="container flex h-16 items-center justify-between ">
        <div>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={55}
              height={40}
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-black transition-colors hover:text-gray-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <Dropdowns />
        </div>
      </div>
    </nav>
  );
}
