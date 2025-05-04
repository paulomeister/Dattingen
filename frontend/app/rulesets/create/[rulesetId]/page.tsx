"use client";

import React from "react";
import RulesetCreator from "@/components/normatives/RulesetCreator";
import { useParams } from "next/navigation";  // Usamos useParams para obtener parámetros de la URL

export default function CreateNormativeItemPage() {
  const params = useParams();
  
  // Aseguramos que rulesetId está disponible en la URL
  const rulesetId = params?.rulesetId;

  if (!rulesetId) {
    return <p>Error: rulesetId not found in URL</p>;
  }

  return (
    <div className="flex items-center justify-center px-5 min-h-screen">
      <div className="w-full h-full bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(111,45,189,0.2)] border border-primary-color/10 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-color to-secondary-color p-6 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Create New Ruleset</h1>
          <p className="text-white/80 mt-2">Upload and annotate documents to create custom audit rulesets</p>
        </div>
        <div className="p-4">
          {/* Pasamos rulesetId al componente RulesetCreator */}
          <RulesetCreator rulesetId={rulesetId} />
        </div>
      </div>
    </div>
  );
}
