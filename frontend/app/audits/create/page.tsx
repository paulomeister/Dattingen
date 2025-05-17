"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CreateAuditPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirigimos a una ruta estática simulada (puedes cambiar el ID)
    router.push("/audits/123");
  };

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

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Audit Name</label>
            <input
              type="text"
              placeholder="e.g., ISO 27001 Audit"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Audit Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm" required>
              <option value="">Select type</option>
              <option>Internal</option>
              <option>External</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Initial Status</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm" required>
              <option value="">Select status</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Relevant details about the audit..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm resize-none"
            />
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
}
