'use client';

import { useState, useEffect } from 'react';
import { UserDTO } from '@/types/User';
import { useAuth } from '@/lib/AuthContext';
import { useApiClient } from '@/hooks/useApiClient';
import { ResponseDTO } from '@/types/ResponseDTO';
import { Business } from '@/types/Business';
import { useLanguage } from "@/lib/LanguageContext";

interface AssociatesSelectionProps {
    onSelect?: (selectedAuditors: UserDTO[]) => void;
    selectedAuditors?: UserDTO[];
}

const AssociatesSelection = ({ onSelect, selectedAuditors: initialSelectedAuditors }: AssociatesSelectionProps) => {
    const [auditors, setAuditors] = useState<UserDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAuditors, setSelectedAuditors] = useState<UserDTO[]>(initialSelectedAuditors || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const apiClient = useApiClient()
    const { t } = useLanguage();

    useEffect(() => {
        const fetchAuditors = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<ResponseDTO<Business>>(`/businesses/api/${user?.businessId}`)

                if (response.status === 200 || response.status === 201
                    && Array.isArray(response.data)) {
                    setAuditors(response.data.associates as UserDTO[]);
                } else {

                    setAuditors([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar auditores');
                console.error('Error fetching auditors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditors();
    }, []);

    const filteredAuditors = auditors.filter(auditor =>
        auditor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auditor.username?.toLowerCase().includes(searchQuery.toLowerCase())
    ); const toggleAuditorSelection = (auditor: UserDTO) => {
        const newSelected = selectedAuditors.some(a => a._id === auditor._id)
            ? selectedAuditors.filter(a => a._id !== auditor._id)
            : [...selectedAuditors, auditor];



        setSelectedAuditors(newSelected);

        // Notificar al componente padre de los cambios inmediatamente
        if (onSelect) {
            onSelect(newSelected);
        }
    };

    if (loading) return <div className="flex justify-center p-8">{t("audits.compactAuditorSelector.loading", "Cargando auditores internos...")}</div>;
    if (error) return <div className="text-red-500 p-4">{t("audits.compactAuditorSelector.error", "Error: ")}{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">{t("audits.compactAuditorSelector.title", "Seleccionar Auditores Internos")}</h2>

            {/* Campo de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder={t("audits.compactAuditorSelector.searchPlaceholder", "Buscar por nombre o usuario...")}
                    className="w-full px-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Lista de auditores */}
            <div className="border rounded-lg overflow-y-auto max-h-80 mb-4">
                {filteredAuditors.length === 0 ? (
                    <div className="p-4 text-gray-500">{t("audits.compactAuditorSelector.noAuditors", "No se encontraron auditores internos")}</div>
                ) : (
                    <ul className="divide-y">
                        {filteredAuditors.map(auditor => (
                            <li
                                key={auditor._id}
                                className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer transition-colors ${selectedAuditors.some(a => a._id === auditor._id) ? 'bg-purple-50' : ''}`}
                                onClick={() => toggleAuditorSelection(auditor)}
                            >
                                <div className="flex-1">
                                    <div className="font-medium">{auditor.name}</div>
                                    <div className="text-sm text-gray-500">@{auditor.username}</div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 text-tertiary-color rounded"
                                    checked={selectedAuditors.some(a => a._id === auditor._id)}
                                    onChange={() => { }} // Controlado por el onClick del li
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Información de selección */}
            <div className="mb-4 text-sm text-gray-700">
                {selectedAuditors.length === 0
                    ? t("audits.compactAuditorSelector.noAuditorSelected", "Ningún auditor seleccionado")
                    : t("audits.compactAuditorSelector.selectedCount", "{count} auditor(es) seleccionado(s)").replace("{count}", selectedAuditors.length.toString())}
            </div>
        </div>
    );
};

export default AssociatesSelection;
