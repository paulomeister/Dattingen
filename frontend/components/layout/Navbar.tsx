"use client";
import Link from "next/link";
import Image from "next/image";
import Dropdowns from "./Dropdowns";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import React, { useEffect } from "react";

export function Navbar() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [navigationLinks, setNavigationLinks] = React.useState<unknown[]>([])

  useEffect(() => {


    setNavigationLinks([
      {
        label: t("navbar.links.home"),
        href: "/",
      },
      {
        label: t("navbar.links.rulesets"),
        href: "/rulesets",
      },

      {
        label: t("navbar.links.business"),
        href: "/business",
      },
      // Solo mostrar el enlace My Business si el usuario tiene un businessId
      // y ese businessId NO es el de ACME
      ...(user?.businessId ? [
        {
          label: t("navbar.links.myBusiness"),
          href: `/business/${user.businessId}`,
        }
      ] : []), ...(user ? [
        {
          label: t("navbar.links.myAudits"),
          href: "/audits",
        },
      ] : [])
    ])
  }, [user])
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