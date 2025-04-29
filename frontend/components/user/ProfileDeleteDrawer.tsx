import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Trash, AlertCircle } from 'lucide-react'
import { UserDTO } from '@/types/User'
import { environment } from '@/env/environment.dev'
import { useLanguage } from '@/lib/LanguageContext'
import { useRouter } from 'next/navigation'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/AuthContext'

interface ProfileEditDrawerProps {
    user: UserDTO
}

const ProfileDeleteDrawer = ({ user }: ProfileEditDrawerProps) => {
    const { logout } = useAuth()
    const { t } = useLanguage()
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteUser = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`${environment.API_URL}/users/api/${user._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error('Failed to delete user')
            }

            toast.success(t('user.profile.success'))
            logout() // Cerrar sesión después de eliminar
            router.push('/') // Redireccionar al inicio después de eliminar
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error(t('user.profile.error'))
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    size="sm"
                    className="mt-5 md:mt-16 flex items-center gap-2 bg-red-600 text-white hover:bg-red-600/80 hover:shadow-lg transition-all duration-300 rounded-lg shadow-md"
                >
                    <Trash className="h-4 w-4" />
                    <span>{t('user.profile.delete')}</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4 max-w-[95vw] sm:max-w-md mx-auto rounded-t-xl">
                <DrawerHeader className="px-4">
                    <DrawerTitle className="text-xl font-bold text-center text-destructive flex items-center justify-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {t('user.profile.confirmDeletion')}
                    </DrawerTitle>
                    <DrawerDescription className="text-center">
                        {t('user.profile.deleteConfirmationMessage')}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-6 flex flex-col items-center space-y-4">
                    <div className="bg-red-600/10 p-4 rounded-lg text-center">
                        <p className="text-sm text-destructive font-medium">
                            {t('user.profile.confirmationQuestion')}
                        </p>
                    </div>
                </div>
                <DrawerFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 sm:justify-end">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            {t('user.profile.cancel')}
                        </Button>
                    </DrawerClose>
                    <Button
                        variant="destructive"
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-600/90 text-white shadow-sm hover:shadow-md transition-all"
                        onClick={handleDeleteUser}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('user.profile.deleting')}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Trash className="h-4 w-4" />
                                {t('user.profile.delete')}
                            </span>
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default ProfileDeleteDrawer
