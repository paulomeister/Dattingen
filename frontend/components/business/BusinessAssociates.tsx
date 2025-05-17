"use client";

import { UsersIcon, PlusIcon } from "lucide-react";
import { Avatar, } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/LanguageContext";
import { getUserImage, getUserRole } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Associate as AssociateType } from "@/types/Associate";
import { Associate as BusinessAssociateType } from "@/types/Business";
import Link from "next/link";

type MixedAssociate = BusinessAssociateType | AssociateType;

interface BusinessAssociatesProps {
  associates: MixedAssociate[];
  businessId: string;
}

export default function BusinessAssociates({ associates, businessId }: BusinessAssociatesProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Solo admins y coordinadores pueden añadir auditores
  const canAddAuditors = user?.role === 'Admin' || user?.role === 'Coordinator';  // Función para obtener el ID de un asociado sin importar su tipo
  const getAssociateId = (associate: MixedAssociate): string => {
    return associate._id;
  };

  // Función para obtener el nombre de usuario de un asociado
  const getUsername = (associate: MixedAssociate): string => {
    // Si tiene propiedad username, la usamos
    if ('username' in associate) {
      return associate.username;
    }
    // Si no tiene username, devolvemos un valor por defecto
    return '???';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UsersIcon size={24} className="text-primary-color" />
          <h2 className="text-2xl font-bold text-primary-color">{t("business.associates.title")}</h2>
        </div>

        {canAddAuditors && (
          <Link
            href={`/business/${businessId}/selectAud`}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary-color hover:bg-secondary-color text-white rounded-md transition-colors text-sm font-medium"
          >
            <PlusIcon size={16} />
            <span>Añadir Auditores</span>
          </Link>
        )}
      </div>      {associates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <UsersIcon size={48} className="mb-2 opacity-50" />
          <p>{t("business.associates.empty")}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 40px)" }}>
          <div className="space-y-3">
            {associates.map((associate) => (
              <div
                key={getAssociateId(associate)}
                className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Avatar className="h-10 w-10 mr-3 bg-primary-color/20">
                  <AvatarImage src={getUserImage(associate?.role)} alt="User profile" />
                </Avatar>
                <div>
                  <p className=" text-primary-color">{getUsername(associate)}</p>
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