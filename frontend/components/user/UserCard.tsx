"use client"

import { UserDTO } from "@/types/User"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/LanguageContext"

interface UserCardProps {
    user: UserDTO
}

export default function UserCard({ user }: UserCardProps) {
    const { t } = useLanguage()

    // Función para generar las iniciales del nombre del usuario
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    // Función para normalizar el rol (asegurar formato correcto)
    const normalizeRole = (role: string): string => {
        // Asegurar que siempre se use el formato correcto, independientemente de cómo venga de la API
        if (typeof role !== 'string') return 'Unknown';

        // Convertir a minúsculas para comparación
        const roleLower = role.toLowerCase();

        // Mapear a los valores correctos del enum
        if (roleLower === 'admin') return 'admin';
        if (roleLower === 'coordinator') return 'Coordinator';
        if (roleLower === 'internalauditor') return 'InternalAuditor';
        if (roleLower === 'externalauditor') return 'ExternalAuditor';

        // Si no coincide con ninguno conocido, devolver el valor original
        return role;
    }

    // Normalizar el rol antes de usarlo
    const normalizedRole = normalizeRole(user.role);

    // Función para traducir el rol a un texto legible
    const getRoleLabel = (role: string) => {
        switch (role) {
            case "admin":
                return t("user.roles.admin")
            case "Coordinator":
                return t("user.roles.coordinator")
            case "InternalAuditor":
                return t("user.roles.auditor")
            case "ExternalAuditor":
                return t("user.roles.externalAuditor")
            default:
                return role
        }
    }

    // Función para determinar el color del badge según el rol
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800 hover:bg-red-200"
            case "Coordinator":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "InternalAuditor":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            case "ExternalAuditor":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    return (
        <Card className="overflow-hidden border border-primary-color/20 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-secondary-color/5 pb-2">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-secondary-color">
                        <AvatarFallback className="bg-primary-color text-white">
                            {getInitials(user.name || user.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg text-primary-color">{user.name || user.username}</CardTitle>
                        <Badge variant="outline" className={`mt-1 ${getRoleBadgeColor(normalizedRole)}`}>
                            {getRoleLabel(normalizedRole)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-primary-color/70" />
                        <span className="text-gray-700">{user.username}</span>
                    </div>



                    {user.businessId && (
                        <div className="flex items-center text-sm">
                            <Building className="h-4 w-4 mr-2 text-primary-color/70" />
                            <span className="text-gray-700 truncate">{t("user.card.business")}: {user.businessId}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}