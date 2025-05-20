"use client";

import { UsersIcon, PlusIcon, Trash2 } from "lucide-react";
import { Avatar, } from "@/components/ui/avatar";
import { useLanguage } from "@/lib/LanguageContext";
import { getUserImage, getUserRole } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Associate as AssociateType } from "@/types/Associate";
import { Associate as BusinessAssociateType } from "@/types/Business";
import Link from "next/link";
import { useApiClient } from "@/hooks/useApiClient";
import React from "react";

type MixedAssociate = BusinessAssociateType | AssociateType;

interface BusinessAssociatesProps {
  associates: MixedAssociate[];
  businessId: string;
}

export default function BusinessAssociates({ associates, businessId }: BusinessAssociatesProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const apiClient = useApiClient();
  const [removingId, setRemovingId] = React.useState<string | null>(null);
  const [localAssociates, setLocalAssociates] = React.useState<MixedAssociate[]>(associates);

  // Solo admins y coordinadores pueden añadir auditores
  const canAddAuditors = user?.role === 'admin' || user?.role === 'Coordinator';  // Función para obtener el ID de un asociado sin importar su tipo
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

  const handleRemove = async (associateId: string) => {
    // No permitir eliminarse a sí mismo
    if (associateId === user?._id) return;
    setRemovingId(associateId);
    try {
      await apiClient.del(`/businesses/api/business/${businessId}/removeAssociate/${associateId}`);
      setLocalAssociates((prev) => prev.filter(a => getAssociateId(a) !== associateId));
    } catch (err) {
      console.error("Error removing associate", err);
    } finally {
      setRemovingId(null);
    }
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
      </div>
      {localAssociates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <UsersIcon size={48} className="mb-2 opacity-50" />
          <p>{t("business.associates.empty")}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 40px)" }}>
          <div className="space-y-3">
            {localAssociates.map((associate) => (
              <div
                key={getAssociateId(associate)}
                className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors group"
              >
                <Avatar className="h-10 w-10 mr-3 bg-primary-color/20">
                  <AvatarImage src={getUserImage(associate?.role)} alt="User profile" />
                </Avatar>
                <div className="flex-1">
                  <p className=" text-primary-color">{getUsername(associate)}</p>
                  <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full inline-block mt-1">
                    {getUserRole(associate.role, user?.language)}
                  </div>
                </div>
                {canAddAuditors && (
                  <button
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                    title={t("business.associates.remove")}
                    onClick={() => handleRemove(getAssociateId(associate))}
                    disabled={removingId === getAssociateId(associate)}
                  >
                    {removingId === getAssociateId(associate) ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}