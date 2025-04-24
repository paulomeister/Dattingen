"use client";
import React from 'react'
import LanguageDropdown from './LanguageDropdown'
import UserDropdown from './UserDropdown'
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

const Dropdowns = () => {
    const { isLoggedIn } = useAuth()

    return (
        <div className="flex items-center justify-center space-x-4 ">
            <LanguageDropdown />
            {isLoggedIn ? (
                <UserDropdown />
            ) : (
                <Link
                    href="/auth/login"
                    className="text-sm font-medium text-primary-color transition-colors hover:text-gray-400"
                >
                    Login
                </Link>
            )}
        </div>
    )
}

export default Dropdowns
