"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { ResponseDTO } from '@/types/ResponseDTO'
import { UserDTO } from '@/types/User'
import { environment } from '@/env/environment.dev'
import ProfileSkeleton from './ProfileSkeleton'
import ProfileError from './ProfileError'
import ProfileNotFound from './ProfileNotFound'
import ProfileContent from './ProfileContent'

const UserClient = () => {
    const params = useParams()
    const { user: authUser, token } = useAuth()
    const [user, setUser] = useState<UserDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const username = params.username as string

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${environment.API_URL}/users/api/search?username=${username}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile')
                }

                const data: ResponseDTO<UserDTO> = await response.json()
                setUser(data.data)
            } catch (err) {
                console.error('Error fetching user profile:', err)
                setError(err instanceof Error ? err.message : 'An error occurred while fetching user data')
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            fetchUserProfile()
        }
    }, [username])

    const isOwnProfile = authUser?.username === username

    if (loading) return <ProfileSkeleton />
    if (error) return <ProfileError error={error} />
    if (!user) return <ProfileNotFound />

    return <ProfileContent user={user} isOwnProfile={isOwnProfile} authUser={authUser} auth={token}/>
}

export default UserClient
