"use client"
import { useApiClient } from '@/hooks/useApiClient'
import { useAuth } from '@/lib/AuthContext'
import React, { useState } from 'react'
import { Inspector, AuditProcess } from '@/types/Audit'
import { UserDTO } from '@/types/User'
import { useParams, useRouter } from "next/navigation";
import AssociatesSelection from '@/components/business/AssociatesSelection'
import { useLanguage } from '@/lib/LanguageContext'

const Page = () => {
  const { user } = useAuth();
  const apiClient = useApiClient();
  const params = useParams();
  const rulesetId = params.rulesetId as string;
  const [assignedIntAuditors, setAssignedIntAuditors] = useState<Inspector[]>([])
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const router = useRouter();
  const { t } = useLanguage()

  if (user?.role !== "Coordinator") {
    return <div className="p-8 text-center text-lg text-red-600">{t("common.accessDenied", "Access denied. Only Coordinators can plan audits.")}</div>
  }

  // Handler to receive selected auditors from InternalAuditorSelector and map to Inspector
  const handleAuditorSelect = (selected: UserDTO[]) => {
    setAssignedIntAuditors(selected.map(aud => ({ _id: aud._id || '', name: aud.name || aud.username || '' })))
  }

  // Handler to remove an internal auditor
  const handleRemoveIntAuditor = (id: string) => {
    setAssignedIntAuditors(prev => prev.filter(a => a._id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setDateError(null);
    // Validación de fechas
    if (startDate && endDate && endDate < startDate) {
      setDateError(t("audits.createAuditProcess.dateError", "End Date cannot be before Start Date"));
      setIsSubmitting(false);
      return;
    }
    try {
      const payload: Partial<AuditProcess> = {
        businessId: user.businessId || "",
        rulesetId,
        assignedIntAuditors,
        status: "NOT_EVALUATED",
        startDate,
        endDate,
        assesments: [],
      };
      await apiClient.post('/audits/api/auditProcesses/create', payload);
      setSubmitSuccess(true);
      router.push('/audits/processes/' + rulesetId);
    } catch {
      setSubmitError(t("audits.createAuditProcess.submitError", "Failed to create audit process"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-primary-color">{t("audits.createAuditProcess.title", "Plan Audit Process")}</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Internal Auditors */}
        <div>
          <label className="block font-semibold mb-2">{t("audits.createAuditProcess.internalAuditors", "Internal Auditors")}</label>
          <AssociatesSelection onSelect={handleAuditorSelect} />
          <div className="flex flex-wrap gap-2 mt-2">
            {assignedIntAuditors.map(aud => (
              <span key={aud._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                {aud.name}
                <button type="button" onClick={() => handleRemoveIntAuditor(aud._id)} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>
        {/* Dates */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-2">{t("audits.createAuditProcess.startDate", "Start Date")}</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border rounded px-3 py-1 w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">{t("audits.createAuditProcess.endDate", "End Date")}</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border rounded px-3 py-1 w-full"
              required
            />
          </div>
        </div>
        {dateError && <div className="text-red-600 mt-2">{dateError}</div>}
        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary-color text-white px-6 py-2 rounded-xl text-sm shadow-sm hover:bg-primary-color/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("audits.createAuditProcess.creating", "Creating...") : t("audits.createAuditProcess.createButton", "Create Audit Process")}
          </button>
        </div>
        {submitSuccess && <div className="text-green-600 mt-2">{t("audits.createAuditProcess.success", "Audit process created successfully!")}</div>}
        {submitError && <div className="text-red-600 mt-2">{submitError}</div>}
      </form>
    </div>
  )
}

export default Page
