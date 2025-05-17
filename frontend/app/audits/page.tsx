"use client";

import React from "react";
import { MyAuditsPage } from "@/components/audits/MyAuditsPage";

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex justify-center py-10 px-4">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-2xl p-8 space-y-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--color-primary-color)] to-[var(--color-secondary-color)] text-white rounded-2xl p-8 shadow text-center">
          <h1 className="text-3xl font-bold mb-2">My Audits Dashboard</h1>
          <p className="text-sm text-[var(--color-contrast-2-color)]">
            Manage your active audits and access their cycles, filters, and statuses.
          </p>
        </div>

        {/* Dashboard Content */}
        <MyAuditsPage />
      </div>
    </div>
  );
}
