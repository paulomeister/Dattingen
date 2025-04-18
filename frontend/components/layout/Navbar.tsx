import Link from "next/link";

import Image from "next/image";
import LanguageDropdown from "./LanguageDropdown";
import UserDropdown from "./UserDropdown";

export function Navbar() {
  //TODO: Implement authentication logic
  const isLoggedIn = false; // Replace with actual authentication logic
  const navigationLinks: any[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Rulesets",
      href: "/rulesets",
    },
    {
      label: "My Audits",
      href: "/progress",
    },
  ];
  return (
    <nav className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md ">
      <div className="container flex h-16 items-center justify-between ">
        <div>
          <Link href="/" className="flex items-center">
            <Image
              src="https://1000marcas.net/wp-content/uploads/2022/06/ACME-Logo-1981.png"
              alt="Company Logo"
              width={70}
              height={50}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#000814] transition-colors hover:text-gray-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-4 ">
          <LanguageDropdown />
          {isLoggedIn ? (
            <UserDropdown />
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[#fca311] transition-colors hover:text-gray-400"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
