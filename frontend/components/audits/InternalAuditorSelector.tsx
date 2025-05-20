'use client';

import { useState, useEffect } from 'react';
import { UserDTO } from '@/types/User';
import { useAuth } from '@/lib/AuthContext';
import { useApiClient } from '@/hooks/useApiClient';
import { Business } from '@/types/Business';
import { environment } from '@/env/environment.dev';

interface InternalAuditorSelectorProps {
    onSelect?: (selectedAuditors: UserDTO[]) => void;
    selectedAuditors?: UserDTO[];
}

const InternalAuditorSelector = ({ onSelect, selectedAuditors: initialSelectedAuditors }: InternalAuditorSelectorProps) => {
    const [auditors, setAuditors] = useState<UserDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAuditors, setSelectedAuditors] = useState<UserDTO[]>(initialSelectedAuditors || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token, user } = useAuth();
    const apiClient = useApiClient();

    useEffect(() => {
        const fetchAuditors = async () => {
            try {
                setLoading(true);
                // 1. Obtener business del usuario autenticado
                const businessRes = await apiClient.get<{ data: Business }>(`/businesses/api/${user?.businessId}`);
                const business = businessRes.data;
                const currentAssociateIds = (business?.associates?.map(a => a._id).filter(Boolean) as string[]) || [];

                // 2. Obtener todos los InternalAuditors
                const response = await fetch(`${environment.API_URL}/users/api/roles/InternalAuditor/users`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                let auditorsList: UserDTO[] = [];
                if (data.status === 200 && Array.isArray(data.data)) {
                    // 3. Filtrar los que NO estén en business.associates
                    const validAssociateIds = currentAssociateIds.filter((id): id is string => typeof id === "string");
                    auditorsList = data.data.filter((aud: UserDTO) => typeof aud._id === "string" && !validAssociateIds.includes(aud._id));
                }
                setAuditors(auditorsList);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar auditores');
                console.error('Error fetching auditors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditors();
    }, [token, user?.businessId, apiClient]);

    const filteredAuditors = auditors.filter(auditor =>
        auditor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auditor.username?.toLowerCase().includes(searchQuery.toLowerCase())
    ); const toggleAuditorSelection = (auditor: UserDTO) => {
        const newSelected = selectedAuditors.some(a => a._id === auditor._id)
            ? selectedAuditors.filter(a => a._id !== auditor._id)
            : [...selectedAuditors, auditor];

        console.log("Selected auditors:", newSelected);


        setSelectedAuditors(newSelected);

        // Notificar al componente padre de los cambios inmediatamente
        if (onSelect) {
            onSelect(newSelected);
        }
    };

    if (loading) return <div className="flex justify-center p-8">Cargando auditores internos...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Seleccionar Auditores Internos</h2>

            {/* Campo de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre o usuario..."
                    className="w-full px-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Lista de auditores */}
            <div className="border rounded-lg overflow-y-auto max-h-80 mb-4">
                {filteredAuditors.length === 0 ? (
                    <div className="p-4 text-gray-500">No se encontraron auditores internos</div>
                ) : (
                    <ul className="divide-y">
                        {filteredAuditors.map(auditor => (
                            <li
                                key={auditor._id}
                                className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer transition-colors ${selectedAuditors.some(a => a._id === auditor._id) ? 'bg-purple-50' : ''
                                    }`}
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
            </div>            {/* Información de selección */}
            <div className="mb-4 text-sm text-gray-700">
                {selectedAuditors.length === 0
                    ? 'Ningún auditor seleccionado'
                    : `${selectedAuditors.length} auditor(es) seleccionado(s)`}
            </div>
        </div>
    );
};

export default InternalAuditorSelector;
