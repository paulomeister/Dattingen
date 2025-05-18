"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Audit, AuditStatus } from "@/types/Audit";
import { Ruleset } from "@/types/Ruleset";
import { useApiClient } from "@/hooks/useApiClient";
import { useAuth } from "@/lib/AuthContext";
import { ResponseDTO } from "@/types/ResponseDTO";
import { Business } from "@/types/Business";

export default function CreateAuditPage() {

  const { user } = useAuth()
  const apiClient = useApiClient();
  const router = useRouter();
  // TODO cambiar la forma de obtención del rulesetId

  const rulesetId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || '' : '';
  const [ruleset, setRuleset] = useState<Ruleset | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {


    const fetchBusiness = async () => {
      if (user) {
        try {
          const response = await apiClient.get<ResponseDTO<Business>>(`/businesses/api/${user.businessId}`);
          setBusiness(response.data);
        } catch (error) {
          console.error("Error fetching business data:", error);
        }
      }
    }

    if (user) {
      fetchBusiness();
    }


    const fetchRulesetData = async () => {
      try {
        const response = await apiClient.get<Ruleset>(`/rulesets/api/findbyid/${rulesetId}`);
        setRuleset(response);
      } catch (error) {
        console.error("Error fetching ruleset data:", error);
      }
    }

    fetchRulesetData();
  }, []);


  useEffect(() => {
    if (business) {
      const hasRulesetId = business.audits.some(audit => audit.rulesetId === rulesetId);

      if (hasRulesetId) {
        alert("You already have an audit with this ruleset."); // TODO Multiingual
        router.push(`/audits/${rulesetId}`);
      }


    }
  }, [business]);

  const [formData, setFormData] = useState({
    name: "",
    rulesetId: rulesetId,
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create audit object according to the Audit interface
      const auditData: Audit = {
        name: formData.name,
        rulesetId: formData.rulesetId,
        status: formData.status as AuditStatus,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      createNewAudit(auditData)
    } catch (error) {
      console.error("Error creating audit:", error);
    }
  };


  const createNewAudit = async (data: Audit) => {
    try {
      const response = await apiClient.post<ResponseDTO<Audit>, Audit>(`/businesses/api/${user?.businessId}/newAudit`, data);
      console.log(response)
      router.push(`/audits/${rulesetId}`);
    } catch (error) {
      console.error("Error creating audit:", error);
      alert("Error creating audit. Please try again."); // TODO Multiingual
    }

  }


  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--color-primary-color)] to-[var(--color-secondary-color)] text-white rounded-xl p-6 shadow text-center">

          <h1 className="text-2xl font-bold">Create New Audit</h1>
          <p className="text-sm text-[var(--color-contrast-2-color)] mt-1">
            Fill in the fields to register a new audit.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-5">
            <span className="text-gray-500">Ruleset Name:</span>
            <span className="text-primary-color font-semibold">{ruleset?.name}</span>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Audit Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
              placeholder="Enter audit name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Initial Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
              required
            >
              <option value={AuditStatus.IN_PROGRESS}>{AuditStatus.IN_PROGRESS}</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[var(--color-primary-color)] text-white px-6 py-2 rounded-2xl hover:bg-[var(--color-secondary-color)] transition shadow"
          >
            Create Audit
          </button>
        </form>
      </div>
    </div>
  );
};