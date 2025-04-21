import React from 'react'
import { UserDTO } from '@/types/User'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import ProfileDetailsSection from './ProfileDetailsSection'
import ProfileEditDrawer from './ProfileEditDrawer'
import { getUserImage } from '@/lib/utils'

interface ProfileContentProps {
    user: UserDTO
    isOwnProfile: boolean
    authUser: UserDTO | null
}

const ProfileContent = ({ user, isOwnProfile, authUser }: ProfileContentProps) => {
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
                        <ProfileEditDrawer user={authUser} />
                    )}
                </CardHeader>

                <CardContent className="p-6">
                    <ProfileDetailsSection user={user} />
                </CardContent>

                <CardFooter className="bg-gray-50 dark:bg-gray-900 p-4 text-center text-sm text-gray-500">
                    {isOwnProfile ?
                        'This is your profile. You can edit your information by clicking the edit button.' :
                        `You are viewing ${user.name}'s profile.`
                    }
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProfileContent