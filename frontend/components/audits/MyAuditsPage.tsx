"use client";
import React from "react";
import Link from "next/link";

export function MyAuditsPage() {
  const audits = [
    { title: "ISO 27001 Audit", status: "In Progress" },
    { title: "Internal Security Audit", status: "Completed" },
    { title: "ISO 9001 Quality Audit", status: "In Progress" },
    { title: "IT Process Audit", status: "In Progress" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md p-6 space-y-6 mr-6 rounded-2xl">
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
        <div className="flex flex-wrap gap-4 justify-between items-center max-w-6xl">
          <input
            type="text"
            placeholder="Search audit..."
            className="h-10 px-4 border border-gray-300 rounded-xl shadow-sm w-full md:w-1/2"
          />
          <select className="h-10 px-3 border border-gray-300 rounded-xl shadow-sm">
            <option>Status: All</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="h-10 px-3 border border-gray-300 rounded-xl shadow-sm">
            <option>Type: All</option>
            <option>Internal</option>
            <option>External</option>
          </select>
        </div>

        {/* Audit Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
          <div className="bg-[var(--color-contrast-2-color)] p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-[var(--color-primary-color)] mb-2">Total Audits</h3>
            <p className="text-3xl font-bold text-gray-800">12</p>
          </div>
          <div className="bg-[var(--color-contrast-2-color)] p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-[var(--color-primary-color)] mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-gray-800">5</p>
          </div>
          <div className="bg-[var(--color-contrast-2-color)] p-6 rounded-2xl shadow text-center">
            <h3 className="text-lg font-semibold text-[var(--color-primary-color)] mb-2">Completed</h3>
            <p className="text-3xl font-bold text-gray-800">7</p>
          </div>
        </div>

        {/* Audit Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {audits.map((audit, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{audit.title}</h4>
              <p className="text-sm text-gray-500 mb-4">Status: {audit.status}</p>
              <button className="px-4 py-2 text-sm bg-[var(--color-primary-color)] text-white rounded-xl hover:bg-[var(--color-secondary-color)] transition">
                View Audit Cycle
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
