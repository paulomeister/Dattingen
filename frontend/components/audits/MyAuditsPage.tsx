"use client";
import React from "react";
import Link from "next/link";

// Simulación estática de auditorías
export function MyAuditsPage() {
  const audits = [
    { id: "1", title: "ISO 27001 Audit", status: "NOT_EVALUATED" },
    { id: "2", title: "Internal Security Audit", status: "EVALUATED" },
    { id: "3", title: "ISO 9001 Quality Audit", status: "NOT_EVALUATED" },
    { id: "4", title: "IT Process Audit", status: "CANCELED" },
  ];

  // Conteo de métricas
  const totalAudits = audits?.length;
  const notEvaluatedCount = audits.filter(a => a.status === "NOT_EVALUATED").length;
  const evaluatedCount = audits.filter(a => a.status === "EVALUATED").length;
  const canceledCount = audits.filter(a => a.status === "CANCELED").length;

  // Formatear status visualmente
  const formatStatus = (status: string) =>
    status
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r shadow-md p-6 space-y-6 md:mr-6 rounded-2xl mb-6 md:mb-0">
        <h2 className="text-xl font-bold text-[var(--color-primary-color)]">Audits</h2>
        <Link href="/audits/create">
          <button className="w-full bg-[var(--color-primary-color)] text-white py-2 px-4 rounded-2xl hover:bg-[var(--color-secondary-color)] transition shadow">
            ➕ Create New Audit
          </button>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl">
          <input
            type="text"
            placeholder="Search audit..."
            className="h-10 px-4 border border-gray-300 rounded-xl shadow-sm w-full md:w-1/2"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <select className="h-10 px-3 border border-gray-300 rounded-xl shadow-sm w-full">
              <option>Status: All</option>
              <option>Not Evaluated</option>
              <option>Evaluated</option>
              <option>Canceled</option>
            </select>
            <select className="h-10 px-3 border border-gray-300 rounded-xl shadow-sm w-full">
              <option>Type: All</option>
              <option>Internal</option>
              <option>External</option>
            </select>
          </div>
        </div>

        {/* Audit Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mt-6">
          <div className="bg-blue-100 p-6 rounded-2xl text-center shadow-sm">
            <h3 className="text-sm font-semibold text-gray-600 mb-2"> Total Audits</h3>
            <p className="text-3xl font-bold text-gray-800">{totalAudits}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-2xl text-center shadow-sm">
            <h3 className="text-sm font-semibold text-gray-600 mb-2"> Not Evaluated</h3>
            <p className="text-3xl font-bold text-gray-800">{notEvaluatedCount}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-2xl text-center shadow-sm">
            <h3 className="text-sm font-semibold text-gray-600 mb-2"> Evaluated</h3>
            <p className="text-3xl font-bold text-gray-800">{evaluatedCount}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-2xl text-center shadow-sm">
            <h3 className="text-sm font-semibold text-gray-600 mb-2"> Canceled</h3>
            <p className="text-3xl font-bold text-gray-800">{canceledCount}</p>
          </div>
        </div>

        {/* Audit Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {audits.map((audit) => (
            <div key={audit.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border transition">
              <h4 className="text-xl font-semibold text-[var(--color-primary-color)] mb-1">{audit.title}</h4>
              <p className="text-sm text-gray-500 mb-4">
                Status: <span className="capitalize font-medium text-gray-700">{formatStatus(audit.status)}</span>
              </p>
              <Link href={`/audits/${audit.id}`}>
                <button className="w-full py-2 text-sm bg-[var(--color-primary-color)] text-white rounded-xl hover:bg-[var(--color-secondary-color)] transition">
                  View audit details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
