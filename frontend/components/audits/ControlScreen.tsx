// ControlScreen.tsx
"use client"
import { useState, type FormEvent, useEffect } from "react"
import { Check, Upload, AlertCircle } from "lucide-react"
import { Control } from "@/types/Ruleset"
import { useAuth } from "@/lib/AuthContext"
import { Assesment, AssesmentStatus, AuditProcess } from "@/types/Audit"
import { useApiClient } from "@/hooks/useApiClient"

interface Props {
    currentProcess: AuditProcess
    assesment: Assesment | null
    control: Control
    readOnly?: boolean
}

type Status = keyof typeof AssesmentStatus

export default function ControlScreen({ control, currentProcess, assesment, readOnly = false }: Props) {
    const [formData, setFormData] = useState({
        comments: "",
        status: "PENDING" as Status,
        evidenceDescription: "",
        evidenceUrl: ""
    })
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const apiClient = useApiClient()

    // Rellenar los campos con el assesment recibido por props al cargar
    useEffect(() => {
        if (assesment) {
            setFormData({
                comments: assesment.comment || "",
                status: assesment.status as unknown as Status,
                evidenceDescription: assesment.evidence?.description || "",
                evidenceUrl: assesment.evidence?.url || ""
            });
        } else {
            setFormData({ comments: "", status: "PENDING", evidenceDescription: "", evidenceUrl: "" });
        }
    }, [assesment]);

    // Opciones de status según el rol
    let statusOptions: { value: string; label: string; icon: string }[] = [];
    if (user?.role === "InternalAuditor") {
        statusOptions = [
            { value: "NOT_DONE", label: "No Realizado / Not Done", icon: "✗✗" },
        ];
    } else if (user?.role === "ExternalAuditor") {
        statusOptions = [
            { value: "COMPLIANT", label: "Cumple / Compliant", icon: "✓" },
            { value: "NON_COMPLIANT", label: "No Cumple / Non-Compliant", icon: "✗" },
        ];
    }

    // Handler para cambio de status por auditor externo
    function handleExternalStatusChange(newStatus: string) {
        if (readOnly || user?.role !== "ExternalAuditor") return;
        setFormData((prev) => ({ ...prev, status: newStatus as Status }));
        setSubmitSuccess(false);
        setSubmitError(null);
    }

    const formattedDescription = control.description.split(";").join(";<br />")

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    // Handle any input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (readOnly) return;
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Nuevo handler para guardar cambios del auditor interno
    async function handleSave(e: FormEvent) {
        e.preventDefault();
        if (readOnly) return;
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError(null);
        try {
            if (user?.role === "InternalAuditor" || user?.role === "ExternalAuditor") {
                const url = `/audits/api/assesments/update?auditProcessId=${currentProcess._id}&controlId=${control.controlId}`;
                await apiClient.put(url, {
                    status: formData.status,
                    comment: formData.comments,
                    evidence: {
                        description: formData.evidenceDescription,
                        url: formData.evidenceUrl
                    }
                });

                setSubmitSuccess(true);
            }
        } catch {
            setSubmitError("Failed to update assessment");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Add isPending state based on assesment status
    const isPending = assesment?.status?.toString().toLowerCase() === "pending";

  
    return (
        <form onSubmit={handleSave} className="p-6 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <header className="flex justify-between items-center flex-wrap gap-3 pb-4 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold text-gray-800">
                        {control.title}
                    </h1>
                    {/* Estado del Assesment */}
                    <div className="flex items-center gap-2 mt-1">
                        {(() => {
                            // Hardcode status labels by language
                            const lang = user?.language === "en" ? "en" : "es";
                            const statusLabels: Record<string, { es: string; en: string; icon: string }> = {
                                COMPLIANT: { es: "✔ Cumple", en: "✔ Compliant", icon: "✔" },
                                NON_COMPLIANT: { es: "✗ No Cumple", en: "✗ Non-Compliant", icon: "✗" },
                                PENDING: { es: "⏳ Pendiente", en: "⏳ Pending", icon: "⏳" },
                                NOT_DONE: { es: "No Realizado", en: "Not Done", icon: "" },
                            };
                            const label = statusLabels[formData.status]?.[lang] || formData.status;
                            return (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                                    ${formData.status === "COMPLIANT" ? "bg-green-100 text-green-700" : ""}
                                    ${formData.status === "NON_COMPLIANT" ? "bg-red-100 text-red-700" : ""}
                                    ${formData.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
                                    ${formData.status === "NOT_DONE" ? "bg-gray-200 text-gray-600" : ""}
                                `}>
                                    {label}
                                </span>
                            );
                        })()}
                    </div>
                </div>
                <div className="bg-red-50 text-red-800 text-sm px-4 py-1.5 rounded-full flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Due: {dueDate.toLocaleDateString("en-US")}</span>
                </div>
            </header>

            {/* Requirement Term */}
            <div className="flex gap-2 text-sm">
                <span className="font-semibold text-gray-700">Requirement:</span>
                <span className="bg-secondary-color text-white px-3 py-1 rounded-full shadow-sm">
                    {control.compulsoriness}
                </span>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-700 border border-gray-100" dangerouslySetInnerHTML={{ __html: formattedDescription }} />

            <div className="space-y-3">
                <h3 className="text-primary-color font-semibold flex items-center gap-2 text-sm">
                    <Upload size={16} /> Evidencia
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-semibold text-gray-600">Descripción de la evidencia</label>
                    <input
                        name="evidenceDescription"
                        placeholder="Descripción de la evidencia"
                        value={formData.evidenceDescription}
                        readOnly={readOnly || !isPending}
                        disabled={readOnly || user?.role !== "InternalAuditor" || !isPending}

                        onChange={handleInputChange}
                        className="border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm"
                    />
                    <label className="text-xs font-semibold text-gray-600">
                        URL de la evidencia</label>
                    <input
                        name="evidenceUrl"
                        placeholder="URL de la evidencia"
                        value={formData.evidenceUrl}
                        onChange={handleInputChange}
                        disabled={readOnly || user?.role !== "InternalAuditor" || !isPending}
                        readOnly={readOnly || !isPending}
                        className="border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm"
                    />
                </div>
            </div>


            <>
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-4">
                        {user?.role === "ExternalAuditor" ? (
                            <div className="flex gap-2">
                                {statusOptions.map((s) => {
                                    let buttonLabel = s.label;
                                    if (s.value === "COMPLIANT") {
                                        buttonLabel = user?.language === "en" ? "Compliant" : "Conformidad";
                                    } else if (s.value === "NON_COMPLIANT") {
                                        buttonLabel = user?.language === "en" ? "Non-compliant" : "No conformidad";
                                    }
                                    return (
                                        <button
                                            key={s.value}
                                            type="button"
                                            onClick={() => handleExternalStatusChange(s.value)}
                                            className={`w-auto min-w-[120px] h-10 rounded-full flex items-center justify-center text-base font-bold px-4
                                                ${formData.status === s.value
                                                    ? "bg-primary-color text-white shadow scale-110"
                                                    : "border border-gray-300 text-gray-400 hover:border-gray-400"
                                                }`}
                                            disabled={readOnly || user?.role !== "ExternalAuditor" || !isPending}
                                        >
                                            {buttonLabel}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div>
                    <h3 className="text-primary-color font-semibold mb-2 text-sm">Comments</h3>
                    <textarea
                        name="comments"
                        rows={3}
                        value={formData.comments}
                        onChange={handleInputChange}
                        placeholder="Write your comments here..."
                        className="w-full border border-gray-200 px-4 py-2 rounded-xl shadow-sm resize-none text-sm"
                        disabled={readOnly || user?.role !== "ExternalAuditor" || !isPending}
                    ></textarea>

                    {submitSuccess && (
                        <div className="mt-2 p-2 bg-green-50 text-green-700 rounded flex items-center gap-2 text-sm">
                            <Check size={16} /> Saved successfully!
                        </div>
                    )}
                    {submitError && (
                        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded flex items-center gap-2 text-sm">
                            <AlertCircle size={16} /> {submitError}
                        </div>
                    )}

                    {isPending && (
                        <button
                            type="submit"
                            disabled={readOnly || isSubmitting}
                            className={`mt-4 w-full h-10 rounded-full flex items-center justify-center text-base font-bold px-4
                                ${isSubmitting ? "bg-gray-300 text-gray-500" : "bg-primary-color text-white hover:bg-secondary-color"}
                            `}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </>

        </form >
    )
}
