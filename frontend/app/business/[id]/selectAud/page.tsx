'use client';

import { use, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import InternalAuditorSelector from '@/components/audits/InternalAuditorSelector';
import { UserDTO } from '@/types/User';
import { registerAuditors } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Associate } from '@/types/Associate';
import { useApiClient } from '@/hooks/useApiClient';
import { useLanguage } from '@/lib/LanguageContext';

export default function MiComponente({ params }: { params: Promise<{ id: string }> }) {
    const { t } = useLanguage();
    const { id: businessId } = use(params); // 🔥 Aquí se desenvuelve el Promise
    const { token, user } = useAuth();
    const [selectedAuditors, setSelectedAuditors] = useState<UserDTO[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();
    const apiClient = useApiClient()
    const handleAuditorSelection = (auditors: UserDTO[]) => {
        setSelectedAuditors(auditors);
    };

    const handleSubmit = async () => {
        if (selectedAuditors.length === 0) {
            setError('Please select at least one auditor');
            return;
        }

        setIsSubmitting(true);
        setError(null); try {
            // Extract the IDs from the selected auditors
            const associates: Associate[] = selectedAuditors.map(auditor => ({
                username: auditor.username as string,
                _id: auditor._id as string,
                role: "InternalAuditor"
            }));

            // Call the API to register auditors
            const response = await registerAuditors(businessId, associates, token);


            selectedAuditors.forEach(associate => {
                apiClient.put(`/users/api/${associate._id}`, {
                    businessId,
                });
            })

            if (response.status === 200) {
                setSuccess(true);
                // Redirect after a short delay to show the success message
                setTimeout(() => {
                    router.push(`/business/${businessId}`);
                }, 2000);
            } else {
                setError(response.message || 'Failed to register auditors');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Error submitting auditors:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push(`/business/${businessId}`);
    };

    // Check if user has permission to access this page
    const hasPermission = user?.role === 'admin' || user?.role === 'Coordinator';

    if (!hasPermission) {
        return (
            <div className="container mx-auto px-4 py-8 mt-20">
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                    <h2 className="text-lg font-semibold">{t("business.selectAud.accessDenied", "Access Denied")}</h2>
                    <p>{t("business.selectAud.noPermission", "You do not have permission to access this page.")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">{t("business.selectAud.title", "Select Internal Auditors")}</h1>
                <p className="mb-6 text-gray-600">
                    {t("business.selectAud.description", "Select internal auditors to assign to this business. They will be responsible for conducting internal audits.")}
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                        {t(error)}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
                        {t("business.selectAud.success", "Auditors have been successfully registered. Redirecting...")}
                    </div>
                )}

                <div className="mb-8">
                    <InternalAuditorSelector onSelect={handleAuditorSelection} />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800"
                        disabled={isSubmitting}
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || success || selectedAuditors.length === 0}
                        className={`py-2 px-4 rounded-lg text-white font-medium ${isSubmitting || selectedAuditors.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary-color hover:bg-secondary-color'
                            }`}
                    >
                        {isSubmitting
                            ? t("business.selectAud.submitting", "Submitting...")
                            : t("business.selectAud.registerAuditors", `Register Auditors (${selectedAuditors.length})`).replace("{count}", selectedAuditors.length.toString())}
                    </Button>
                </div>
            </div>
        </div>
    );
}