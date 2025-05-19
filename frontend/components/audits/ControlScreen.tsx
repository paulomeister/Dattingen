// ControlScreen.tsx
"use client"
import { useState, type FormEvent, useEffect } from "react"
import { Check, Upload, AlertCircle } from "lucide-react"
import { Control } from "@/types/Ruleset"
import { useAuth } from "@/lib/AuthContext"
import { Assesment, AssesmentStatus, AuditProcess } from "@/types/Audit"

interface Props {
    currentProcess: AuditProcess
    assesment: Assesment | null
    control: Control
}

type Status = keyof typeof AssesmentStatus

export default function ControlScreen({ control, currentProcess, assesment }: Props) {
    const [formData, setFormData] = useState({
        comments: "",
        status: "PENDING" as Status,
        evidenceDescription: "",
        evidenceUrl: ""
    })
    const { user } = useAuth()
    const [assesmentStatus, setAssesmentStatus] = useState<AssesmentStatus | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isInternalAuditor, setIsInternalAuditor] = useState(false);
    const [isExternalAuditor, setIsExternalAuditor] = useState(false);
    // isPending y isEditable deben depender de formData.status
    const isPending = formData.status === "PENDING";
    const isEditable = isPending && (isInternalAuditor || isExternalAuditor);

    // Rellenar los campos con el assesment recibido por props al cargar
    useEffect(() => {
        if (assesment) {
            setFormData({
                comments: assesment.comment || "",
                status: assesment.status as unknown as Status,
                evidenceDescription: assesment.evidence?.description || "",
                evidenceUrl: assesment.evidence?.url || ""
            });
            setAssesmentStatus(assesment.status);
        } else {
            setFormData({ comments: "", status: "PENDING", evidenceDescription: "", evidenceUrl: "" });
            setAssesmentStatus(null);
        }
    }, [assesment]);

    useEffect(() => {
        setIsInternalAuditor(user?.role === "InternalAuditor");
        setIsExternalAuditor(user?.role === "ExternalAuditor");
    }, [user, assesmentStatus]);

    // Opciones de status según el rol
    let statusOptions: { value: string; label: string; icon: string }[] = [];
    if (isInternalAuditor) {
        statusOptions = [
            { value: "NOT_DONE", label: "No Realizado / Not Done", icon: "✗✗" },
        ];
    } else if (isExternalAuditor) {
        statusOptions = [
            { value: "COMPLIANT", label: "Cumple / Compliant", icon: "✓" },
            { value: "NON_COMPLIANT", label: "No Cumple / Non-Compliant", icon: "✗" },
        ];
    }

    // Handler para cambio de status por auditor externo
    function handleExternalStatusChange(newStatus: string) {
        if (!isExternalAuditor || !isPending) return;
        // Permitir cambiar entre opciones aunque ya esté seleccionada
        setFormData((prev) => ({ ...prev, status: newStatus as Status }));
        setAssesmentStatus(newStatus as unknown as AssesmentStatus);
        setSubmitSuccess(false);
        setSubmitError(null);
    }

    const formattedDescription = control.description.split(";").join(";<br />")

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    // Handle any input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Nuevo handler para guardar cambios del auditor interno
    async function handleSave(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError(null);
        try {
            // Solo para auditor interno
            if (isInternalAuditor && isEditable) {
                const url = `/audits/api/assesments/update?auditProcessId=${currentProcess._id}&controlId=${control.controlId}`;
                const body = {
                    status: formData.status,
                    comment: formData.comments,
                    evidence: {
                        description: formData.evidenceDescription,
                        url: formData.evidenceUrl
                        // addedDate will be set by backend
                    }
                };
                const res = await fetch(url, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (!res.ok) throw new Error("Failed to update assessment");
                setAssesmentStatus(formData.status as unknown as AssesmentStatus);
                setSubmitSuccess(true);
            }
        } catch {
            setSubmitError("Failed to update assessment");
        } finally {
            setIsSubmitting(false);
        }
    }

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
                        onChange={handleInputChange}
                        className="border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm"
                        disabled={!isEditable}
                    />
                    <label className="text-xs font-semibold text-gray-600">URL de la evidencia</label>
                    <input
                        name="evidenceUrl"
                        placeholder="URL de la evidencia"
                        value={formData.evidenceUrl}
                        onChange={handleInputChange}
                        className="border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm"
                        disabled={!isEditable}
                    />
                </div>
            </div>

            {/* Status Picker */}
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                    {isExternalAuditor ? (
                        <div className="flex gap-2">
                            {statusOptions.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => handleExternalStatusChange(s.value)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                                        ${formData.status === s.value
                                            ? "bg-primary-color text-white shadow scale-110"
                                            : "border border-gray-300 text-gray-400 hover:border-gray-400"
                                        }`}
                                    disabled={!isEditable || isSubmitting}
                                >
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Comments */}
            <div>
                <h3 className="text-primary-color font-semibold mb-2 text-sm">Comments</h3>
                <textarea
                    name="comments"
                    rows={3}
                    value={formData.comments}
                    onChange={handleInputChange}
                    placeholder="Write your comments here..."
                    className="w-full border border-gray-200 px-4 py-2 rounded-xl shadow-sm resize-none text-sm"
                    readOnly={isInternalAuditor}
                    disabled={!isEditable && !isExternalAuditor}
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

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-primary-color text-white px-6 py-2 rounded-xl text-sm shadow-sm
                        ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-color/90"}`}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </form>
    )
}
