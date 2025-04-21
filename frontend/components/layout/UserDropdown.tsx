import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "lucide-react";
import { RoleEnum } from "@/types/RoleEnum";
import { useAuth } from "@/lib/AuthContext";
const UserDropdown = () => {

  const { user } = useAuth()

  //TODO ! Cambiar lenguaje
  const getUserImage = (role: RoleEnum | undefined): string => {
    switch (role) {
      case "InternalAuditor":
        return "/images/avatars/internal_auditor.png";
      case "Coordinator":
        return "/images/avatars/coordinator.png";
      case "ExternalAuditor":
        return "/images/avatars/external_auditor.png";
      case "Admin":
        return "/images/avatars/admin.png";
      default:
        return "/images/avatars/default.png";
    }
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={getUserImage(user?.role)} alt="User profile" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-primary-color hover:text-white 
          transition-colors duration-100 ease-in-out">
          <User className="mr-2 h-4 w-4" />
          <span >Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-primary-color hover:text-white 
          transition-colors duration-100 ease-in-out">
          <Settings className="mr-2 h-4 w-4" />
          <span >Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-primary-color hover:text-white 
          transition-colors duration-100 ease-in-out">
          <LogOut className="mr-2 h-4 w-4" />
          <span >Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
