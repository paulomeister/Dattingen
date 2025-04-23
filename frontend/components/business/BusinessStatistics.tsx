"use client";

import { Audit } from "@/types/Audit";
import { BarChart3Icon } from "lucide-react";

interface BusinessStatisticsProps {
  audits: Audit[];
}

export default function BusinessStatistics({ audits }: BusinessStatisticsProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3Icon size={24} className="text-primary-color" />
        <h2 className="text-2xl font-bold text-primary-color">STATISTICS</h2>
      </div>
      
      {audits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <BarChart3Icon size={48} className="mb-2 opacity-50" />
          <p>No audits data available yet</p>
          <p className="text-sm mt-2">Statistics will appear when audits are completed</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 bg-primary-color/5">
            <h3 className="text-sm font-medium mb-2">Total Audits</h3>
            <p className="text-3xl font-bold">{audits.length}</p>
          </div>
          
          <div className="rounded-lg border p-4 bg-primary-color/5">
            <h3 className="text-sm font-medium mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold">--</p>
          </div>
          
          <div className="rounded-lg border p-4 bg-primary-color/5">
            <h3 className="text-sm font-medium mb-2">Average Score</h3>
            <p className="text-3xl font-bold">--</p>
          </div>
          
          <div className="rounded-lg border p-4 bg-primary-color/5">
            <h3 className="text-sm font-medium mb-2">Latest Audit</h3>
            <p className="text-3xl font-bold">--</p>
          </div>
          
          {/* Placeholder for future statistics */}
          <div className="col-span-2 rounded-lg border p-4 bg-primary-color/5 h-40 flex items-center justify-center">
            <p className="text-gray-500">Detailed audit statistics will be available soon</p>
          </div>
        </div>
      )}
    </div>
  );
}