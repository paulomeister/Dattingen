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
import { useAuth } from "@/lib/AuthContext";
import { getUserImage } from "@/lib/utils";
const UserDropdown = () => {

  const { user, logout } = useAuth()



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
          transition-colors duration-100 ease-in-out"

          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span >Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
