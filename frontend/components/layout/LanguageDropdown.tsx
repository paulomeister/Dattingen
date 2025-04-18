import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";
import { Button } from "../ui/button";
import { Globe2 } from "lucide-react";

const LanguageDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
        <DropdownMenuItem>🇪🇸 Español</DropdownMenuItem>
        <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
