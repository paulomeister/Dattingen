"use client"
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserRoundCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getUserImage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";


const UserDropdown = () => {

  const router = useRouter();
  const { user, logout } = useAuth()
  const { t } = useLanguage();

  const navigateToProfile = (username: string) => {
    router.push(`/user/profile/${username}`);
  };

  const navigateToAdmin = () => {
    router.push("/admin/create-user");
  }

  const isAdmin = user?.role.toLowerCase() === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={getUserImage(user?.role)} alt="User profile" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{
          t("navbar.userDropdown.title")
        }</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Mostrar opción de perfil solo para usuarios que NO son Admin */}
        {!isAdmin && (
          <>
            <DropdownMenuItem className="cursor-pointer hover:bg-primary-color hover:text-white 
              transition-colors duration-100 ease-in-out"
              onClick={() => navigateToProfile(user!.username)}
            >
              <User className="mr-2 h-4 w-4" />
              <span>{t("navbar.userDropdown.profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Panel de administración solo para Admin */}
        {isAdmin && (
          <>
            <DropdownMenuItem className="cursor-pointer hover:bg-primary-color hover:text-white
              transition-colors duration-100 ease-in-out"
              onClick={navigateToAdmin}
            >
              <UserRoundCog className="mr-2 h-4 w-4" />
              <span>{t("navbar.userDropdown.admin")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem className="cursor-pointer hover:bg-primary-color hover:text-white 
          transition-colors duration-100 ease-in-out"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("navbar.userDropdown.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;