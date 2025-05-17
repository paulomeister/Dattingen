'use client';

import { useState } from 'react';
import { UserDTO } from '@/types/User';
import { useAuth } from '@/lib/AuthContext';
import { environment } from '@/env/environment.dev';

interface CompactAuditorSelectorProps {
    onSelect: (auditor: UserDTO) => void;
    buttonLabel?: string;
}

const CompactAuditorSelector = ({ onSelect, buttonLabel = "Seleccionar auditor" }: CompactAuditorSelectorProps) => {
    const [auditors, setAuditors] = useState<UserDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const fetchAuditors = async () => {
        if (auditors.length > 0) return; // Solo cargar una vez

        try {
            setLoading(true);
            const response = await fetch(`${environment.API_URL}/users/api/search?role=InternalAuditor`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 200 && Array.isArray(data.data)) {
                setAuditors(data.data);
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

    const handleOpen = () => {
        setIsOpen(true);
        fetchAuditors();
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleSelectAuditor = (auditor: UserDTO) => {
        onSelect(auditor);
        handleClose();
    };

    const filteredAuditors = auditors.filter(auditor =>
        auditor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auditor.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleOpen}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
                {buttonLabel}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Seleccionar Auditor Interno</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o usuario..."
                                className="w-full px-4 py-2 border rounded-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="border rounded-lg overflow-y-auto max-h-64 mb-4">
                            {loading && <div className="p-4 text-center">Cargando...</div>}

                            {error && <div className="p-4 text-red-500">{error}</div>}

                            {!loading && !error && filteredAuditors.length === 0 && (
                                <div className="p-4 text-gray-500 text-center">No se encontraron auditores</div>
                            )}

                            {!loading && !error && filteredAuditors.length > 0 && (
                                <ul className="divide-y">
                                    {filteredAuditors.map(auditor => (
                                        <li
                                            key={auditor._id}
                                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => handleSelectAuditor(auditor)}
                                        >
                                            <div className="font-medium">{auditor.name}</div>
                                            <div className="text-sm text-gray-500">@{auditor.username}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompactAuditorSelector;
