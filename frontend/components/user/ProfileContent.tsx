import React from 'react'
import { UserDTO } from '@/types/User'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import ProfileDetailsSection from './ProfileDetailsSection'
import ProfileEditDrawer from './ProfileEditDrawer'
import { getUserImage } from '@/lib/utils'
import ProfileDeleteDrawer from './ProfileDeleteDrawer'
import { Button } from '../button'
import { useRouter } from 'next/navigation'
import { useLanguage } from "@/lib/LanguageContext";

interface ProfileContentProps {
    user: UserDTO
    isOwnProfile: boolean
    authUser?: UserDTO | null
}

const ProfileContent = ({ user, isOwnProfile, authUser }: ProfileContentProps) => {

    const router = useRouter()
    const { t } = useLanguage();

    // Helper function to get role badge color
    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-500 hover:bg-red-600'
            case 'MANAGER':
                return 'bg-blue-500 hover:bg-blue-600'
            default:
                return 'bg-gray-500 hover:bg-gray-600'
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card className="w-full overflow-hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b relative">
                    <Avatar className="h-24 w-24 border-2 border-primary-color shadow-md">
                        <AvatarImage src={getUserImage(user.role)} alt={user.name} />
                        <AvatarFallback className="text-xl bg-primary-color text-white">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-500">@{user.username}</p>
                        <Badge className={`${getRoleBadgeClass(user.role)} text-white shadow-sm`}>
                            {user.role}
                        </Badge>
                    </div>

                    {isOwnProfile && authUser && (
                        <div className="flex items-center justify-center">
                            {user.role === 'Coordinator' && !user.businessId && (
                                <Button
                                    className="bg-gradient-to-r from-primary-color via-secondary-color to-primary-color bg-[length:200%_200%] animate-gradient-x text-white rounded-lg px-4 py-2 mr-2 border-0 shadow-md transition-all duration-300"
                                    onClick={() => {
                                        router.push(`/business/create/`)
                                    }}
                                    variant="outline">
                                    {t("business.create.button", "Crear Empresa")}
                                </Button>
                            )}
                            <ProfileDeleteDrawer user={authUser} />
                            <ProfileEditDrawer user={authUser} />
                        </div>
                    )}
                </CardHeader>


                <CardContent className="p-6">

                    <ProfileDetailsSection user={user} />
                </CardContent>

            </Card>
        </div>
    )
}

export default ProfileContent