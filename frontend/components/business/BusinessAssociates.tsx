"use client";

import { UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserDTO } from "@/types/User";
import { useLanguage } from "@/lib/LanguageContext";
import { getUserImage, getUserRole } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { AvatarImage } from "@radix-ui/react-avatar";

interface BusinessAssociatesProps {
  associates: UserDTO[];
}

export default function BusinessAssociates({ associates }: BusinessAssociatesProps) {
  const { user } = useAuth();

  const { t } = useLanguage();
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon size={24} className="text-primary-color" />
        <h2 className="text-2xl font-bold text-primary-color">{t("business.associates.title")}</h2>
      </div>

      {associates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <UsersIcon size={48} className="mb-2 opacity-50" />
          <p>{t("business.associates.empty")}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 40px)" }}>
          <div className="space-y-3">
            {/* ! TODO: REVISAR */}
            {associates.map((associate) => (
              <div
                key={Math.random()}
                className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Avatar className="h-10 w-10 mr-3 bg-primary-color/20">
                  <AvatarImage src={getUserImage(associate?.role)} alt="User profile" />
                </Avatar>
                <div>
                  <p className=" text-primary-color">{associate.username}</p>
                  <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full inline-block mt-1">
                    {getUserRole(associate.role, user?.language)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}