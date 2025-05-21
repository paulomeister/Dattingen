'use client';

import InternalAuditorSelector from '@/components/audits/InternalAuditorSelector';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getUserImage } from '@/lib/utils';
import { UserDTO } from '@/types/User';
import { useLanguage } from '@/lib/LanguageContext';
import { useState } from 'react';

export default function AuditorSelectionPage() {
    const { t } = useLanguage();
    const [selectedAuditors, setSelectedAuditors] = useState<UserDTO[]>([]);
    const [showSelectedList, setShowSelectedList] = useState(false);

    const handleAuditorsSelected = (auditors: UserDTO[]) => {
        setSelectedAuditors(auditors);
        setShowSelectedList(true);
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">{t("audits.selectAuditors.title", "Selección de Auditores Internos")}</h1>

            <div className="mb-8">
                <InternalAuditorSelector onSelect={handleAuditorsSelected} />
            </div>

            {showSelectedList && selectedAuditors.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">{t("audits.selectAuditors.selectedTitle", "Auditores Seleccionados")}</h2>
                    <ul className="divide-y border rounded-lg">
                        {selectedAuditors.map(auditor => (
                            <li key={auditor._id} className="p-3">
                                <Avatar className="h-10 w-10 mr-3 bg-primary-color/20">
                                    <AvatarImage src={getUserImage(auditor?.role)} alt="User profile" />
                                </Avatar>
                                <div className="font-medium">{auditor.name}</div>
                                <div className="text-sm text-gray-500">@{auditor.username}</div>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setShowSelectedList(false)}
                        className="mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800"
                    >
                        {t("audits.selectAuditors.hideList", "Ocultar lista")}
                    </button>
                </div>
            )}
        </div>
    );
}
