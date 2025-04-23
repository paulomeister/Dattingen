"use client"
import { useLanguage } from '@/lib/LanguageContext'
import React from 'react'

const BusinessCreationHeader = () => {

    const { t } = useLanguage()

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">{t("business.create.title")}</h1>
            <p className="text-gray-600 mb-8 text-center">
                {t("business.create.subtitle")}
            </p>
        </div>
    )
}

export default BusinessCreationHeader
