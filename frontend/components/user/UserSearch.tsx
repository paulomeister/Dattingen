"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { environment } from "@/env/environment.dev"
import { useLanguage } from "@/lib/LanguageContext"
import { Search, Loader2 } from "lucide-react"
import { UserDTO } from "@/types/User"
import UserCard from "./UserCard"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UserSearch() {
    const { t } = useLanguage()
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState<UserDTO[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isInitialState, setIsInitialState] = useState(true)

    // Función para buscar usuarios
    const searchUsers = async () => {
        if (!searchTerm.trim()) {
            setUsers([])
            setIsInitialState(true)
            return
        }

        setIsLoading(true)
        setError(null)
        setIsInitialState(false)

        try {
            const response = await fetch(`${environment.API_URL}/users/api/search/users?q=${searchTerm}`,
                { headers: { 'Authorization': localStorage.getItem('token') || '' } })

            const data = await response.json()

            // Manejar el caso de un solo usuario o múltiples usuarios
            if (data.status === 200) {
                if (Array.isArray(data.data)) {
                    setUsers(data.data)
                } else {
                    // Si la respuesta es un solo usuario, lo convertimos en un array
                    setUsers([data.data])
                }
            } else {
                throw new Error(data.message || "Error al buscar usuarios")
            }
        } catch (err) {
            console.error("Error searching users:", err)
            setError(t("user.search.error"))
            setUsers([])
        } finally {
            setIsLoading(false)
        }
    }// !  Arreglar esto 

    // Usar el hook de debounce para retrasar la búsqueda mientras el usuario escribe
    useDebounce(searchUsers, [searchTerm], 500)

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Search className="h-5 w-5" />
                </div>
                <Input
                    type="text"
                    placeholder={t("user.search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-primary-color/30 focus-visible:ring-secondary-color"
                    data-testid="user-search-input"
                />
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary-color" />
                </div>
            )}

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!isLoading && !error && users.length === 0 && !isInitialState && (
                <div className="text-center py-8 text-gray-500">
                    {t("user.search.noResults")}
                </div>
            )}

            {isInitialState && (
                <div className="text-center py-8 text-gray-500">
                    {t("user.search.initialMessage")}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {users.map((user) => (
                    <UserCard key={user._id} user={user} />
                ))}
            </div>
        </div>
    )
}