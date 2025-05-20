import React, { useEffect, useState } from 'react'
import { UserDTO } from '@/types/User'
import { Globe, User as Building2 } from 'lucide-react'
import { environment } from '@/env/environment.dev'
import { toast } from "react-hot-toast";
import { Business } from '@/types/Business';
import { useLanguage } from '@/lib/LanguageContext';
import { ResponseDTO } from '@/types/ResponseDTO';

interface ProfileDetailsSectionProps {
    user: UserDTO,
}

const ProfileDetailsSection = ({ user }: ProfileDetailsSectionProps) => {

    const [business, setBusiness] = useState<Business | null>()
    const { t } = useLanguage()

    useEffect(() => {

        const fetchBusiness = async () => {
            try {
                const response = await fetch(`${environment.API_URL}/businesses/api/${user.businessId}`,
                  { headers: { 'Authorization': localStorage.getItem('token') || '' } })
                if (!response.ok) throw new Error('Failed to fetch business data')
                const data: ResponseDTO<Business> = await response.json()
                setBusiness(data.data)
            } catch (error) {
                toast.error(t("user.profile.erroFetchingBusiness"))
                console.error('Error fetching business data:', error)
            }
        }

        if (user.businessId) {
            fetchBusiness()
        }

    }, [])


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">


                {/* TODO Implement the Business  */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                    <div className="p-2 bg-primary-color rounded-full">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                        {t("user.profile.business")}: <span className="font-semibold text-black">{business?.name}</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                    <div className="p-2 bg-primary-color rounded-full">
                        <Globe className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                        {t("user.profile.language")}: <span className="font-semibold">{user.language.toUpperCase()}</span>
                    </span>
                </div>
            </div>

        </div>
    )
}

export default ProfileDetailsSection