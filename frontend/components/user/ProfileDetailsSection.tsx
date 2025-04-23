import React from 'react'
import { UserDTO } from '@/types/User'
import { Globe, User as UserIcon, Building, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ProfileDetailsSectionProps {
    user: UserDTO
}

const ProfileDetailsSection = ({ user }: ProfileDetailsSectionProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">


                {/* TODO Implement the Business  */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                    <div className="p-2 bg-primary-color rounded-full">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                        Bussiness: <span className="font-semibold">Other.</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                    <div className="p-2 bg-primary-color rounded-full">
                        <Globe className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                        Language: <span className="font-semibold">{user.language.toUpperCase()}</span>
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {user.businessId && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                        <div className="p-2 bg-primary-color rounded-full">
                            <Building className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                            Business ID: <span className="font-semibold">{user.businessId}</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileDetailsSection