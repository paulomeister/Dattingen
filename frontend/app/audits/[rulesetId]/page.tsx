"use client";

import React from "react";
import { useParams } from "next/navigation";

const auditDescriptions: Record<string, string> = {
  "1": "Audit for ISO 27001 compliance, focusing on information security standards.",
  "2": "Internal Security Audit to assess internal IT and organizational practices.",
  "3": "Audit based on ISO 9001 to ensure quality management processes are followed.",
  "4": "IT process audit focused on infrastructure, operations, and automation.",
};

export default function AuditDetailPage() {
  const { id } = useParams();
  const description = auditDescriptions[id as string] || "No description available.";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col md:flex-row gap-6 overflow-x-hidden">
      {/* Sidebar de fases */}
      <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-md border space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-[var(--color-primary-color)]">Audit #{id}</h2>
          <span className="text-xs text-gray-500">Audit ID: {id}</span>
          <p className="text-sm text-gray-700 mt-2">{description}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Plan</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Criterion 1.1</li>
            <li>Criterion 1.2</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Do</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li className="font-bold text-[var(--color-primary-color)]">Criterion 3.3</li>
            <li>Criterion 3.4</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Check</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Criterion 4.1</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Act</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Criterion 5.1</li>
            <li>Criterion 5.2</li>
          </ul>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-6 overflow-x-auto">
        <header className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-2xl font-bold">Audit #{id} - Criterion 3.3</h1>
          <div className="bg-red-100 text-red-800 text-sm px-4 py-2 rounded-full shadow">
            Due Date: June 18, 2025
          </div>
        </header>

        <section className="space-y-4">
          {/* Obligación */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">Requirement Term:</span>
            <span className="bg-[var(--color-secondary-color)] text-white px-3 py-1 rounded-full text-sm">Shall</span>
          </div>

          {/* Texto del criterio */}
          <div className="bg-gray-100 p-4 rounded-2xl text-sm text-gray-700 shadow-inner">
            Persons doing work under the organization’s control shall be aware of:<br />
            a) the information security policy;<br />
            b) their contribution to the effectiveness of the information security management system;<br />
            c) the implications of not conforming with the information security management system.
          </div>

          {/* Documentación */}
          <div>
            <h3 className="font-semibold text-[var(--color-primary-color)] mb-2">Documentation</h3>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Document URL or Name"
                className="flex-1 border px-4 py-2 rounded-2xl shadow-sm"
              />
              <button className="bg-[var(--color-primary-color)] text-white px-4 py-2 rounded-2xl hover:bg-[var(--color-secondary-color)] transition">
                Upload New
              </button>
            </div>
          </div>

          {/* Estado */}
          <div>
            <h3 className="font-semibold text-[var(--color-primary-color)] mb-2">Status</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center font-bold text-lg text-gray-600">
                ?
              </div>
              <span className="text-gray-600">To Be Evaluated</span>
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <h3 className="font-semibold text-[var(--color-primary-color)] mb-2">Comments</h3>
            <textarea
              rows={4}
              placeholder="Write your comments here..."
              className="w-full border px-4 py-2 rounded-2xl shadow-sm resize-none"
            ></textarea>
            <button className="mt-3 bg-[var(--color-primary-color)] text-white px-6 py-2 rounded-2xl hover:bg-[var(--color-secondary-color)] transition">
              Submit
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
